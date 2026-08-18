import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError, finalize } from 'rxjs/operators';
import { ObservableService } from 'src/app/utils/observable.service';
import { SesionService } from 'src/app/utils/sesion.service';
import { environment } from 'src/environments/environment';

/**
 * La vigencia del token la decide el ws, que es quien firma el JWT y conoce su
 * claim `exp`. El front no la calcula: adjunta el token que tenga y, si el ws
 * responde 401, cierra sesion y manda al login.
 *
 * Antes se llevaba un contador local de minutos y se renovaba el token con un
 * re-login silencioso usando las credenciales guardadas. Eso duplicaba la
 * politica de expiracion en dos lugares que ya no coincidian (60 min aqui contra
 * 24 h en el ws), dependia del reloj del equipo del usuario y no se enteraba de
 * revocaciones del lado del servidor.
 */
@Injectable({
  providedIn: 'root'
})
export class InterceptorRediectService implements HttpInterceptor {
  token: any;
  private totalRequests = 0;
  constructor(
    private router: Router,
    private sesionService: SesionService,
    private loaderService: ObservableService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    this.totalRequests++;
    //this.loaderService.isLoading.next(true);
    this.token = this.sesionService.getTokenWs();
    let request = req;

    if (request.url.includes('crm/')) {
      // Reporteria autentica con su propia api key, no con la sesion del doctor.
      request = this.addApiKeyReporteria(request);
    } else if (this.token && !request.url.includes('paciente/login')) {
      if (request.url.includes('sim/registrarMasivoSim')) {
        request = this.addFormData(request, this.token.token);
      } else {
        request = this.addToken(request, this.token.token);
      }
    }

    return next.handle(request).pipe(
      finalize(() => {
        this.totalRequests--;
        if (this.totalRequests <= 0) {
          this.loaderService.isLoading.next(false);
        }
      }),
      catchError((err: HttpErrorResponse) => {
        this.loaderService.isLoading.next(false);

        if (this.esSesionInvalida(err, request)) {
          return this.cerrarSesionYRedirigir(err);
        }

        return throwError(err);
      })
    );
  }

  /**
   * El ws responde 401 cuando el token falta, no trae el prefijo Bearer-PP o no
   * verifica (firma invalida o expirado). En los tres casos no hay nada que
   * reintentar desde el front.
   */
  private esSesionInvalida(err: HttpErrorResponse, request: HttpRequest<any>) {
    if (err.status !== 401) {
      return false;
    }
    // Reporteria no usa la sesion, y en el login todavia no hay sesion que cerrar.
    return !request.url.includes('crm/') && !request.url.includes('paciente/login');
  }

  private cerrarSesionYRedirigir(err: HttpErrorResponse) {
    this.sesionService.cerrarSesion();
    this.router.navigate(['/auth/login']);
    return throwError(err);
  }

  private addFormData(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        //'Content-Type': 'multipart/form-data',
        'authorization-pp': `Bearer-PP ${token}`,
        //'Accept': 'application/json'
      }
    });
  }

  private addApiKeyReporteria(request: HttpRequest<any>) {
    return request.clone({
      setHeaders: {
        'authorization-pp': `Bearer-PP ${environment.apiKeyReporteria}`,
      }
    });
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        'authorization-pp': `Bearer-PP ${token}`
      }
    });
  }

}
