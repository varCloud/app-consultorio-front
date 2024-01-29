import { LoginService } from 'src/app/servicios/login/login.service';
import {
  HttpErrorResponse,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError, finalize, switchMap } from 'rxjs/operators';
import { TokenService } from 'src/app/servicios/token/token.service';
import { ObservableService } from 'src/app/utils/observable.service';
import { SesionService } from 'src/app/utils/sesion.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InterceptorRediectService implements HttpInterceptor {
  token: any;
  vigenciaToken = 60; //valor en minutos
  private totalRequests = 0;
  constructor(
    private router: Router,
    private wsToken: TokenService,
    private sesionService: SesionService,
    private loaderService: ObservableService,
    private loginService: LoginService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    this.totalRequests++;
    //this.loaderService.isLoading.next(true);
    this.token = this.sesionService.getTokenWs();
    let request = req;

    if (!request.url.includes('usuario/login')) {
      if (this.token) {

        let diffMins = 0;
        const fechaActual: any = new Date();
        const fechaToken: any = new Date(this.token.fechaToken);
        const diff = fechaActual - fechaToken;
        diffMins = Math.round(((diff % 86400000) % 3600000) / 60000);
        //console.log("diffmins", diffMins);
        if (diffMins > this.vigenciaToken) {
          return this.ActualizarToken(request, next);
        } else {
           if(request.url.includes('crm/')){
            request = this.addApiKeyReporteria(request);
          }else{
             if (request.url.includes('sim/registrarMasivoSim')) {
              request = this.addFormData(request, this.token.token);
            } else {
              request = this.addToken(request, this.token.token);
            }
          }
        }
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
        if (err.status === 401) {
          //console.log("err.status", err.status)
          this.loaderService.isLoading.next(false);
          return this.ActualizarToken(request, next)

        }
        this.loaderService.isLoading.next(false);
        return throwError(err);
      })
    );
  }

  private addFormData(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        //'Content-Type': 'multipart/form-data',
        'authorization-pp': `Bearer-PP ${this.token.token}`,
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
        'authorization-pp': `Bearer-PP ${this.token.token}`
      }
    });
  }



  private ActualizarToken(request: HttpRequest<any>, next: HttpHandler) {

    let sesion = this.sesionService.getSesion()
    let postData = { usuario: sesion.usuario, contrasena: sesion.contrasena }
    return this.loginService.login(postData).pipe(
      finalize(() => {
        this.loaderService.isLoading.next(false);
      }),
      switchMap((data: any) => {
        this.token = {};
        this.token.token = data.modelo.tokenWs;
        this.token.fechaToken = new Date();
        this.sesionService.setTokenWs(this.token);
        this.sesionService.setSesion(data.modelo);
        return next.handle(this.addToken(request, this.token));
      }));
  }

}
