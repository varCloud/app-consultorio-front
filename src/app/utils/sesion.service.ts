import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { CifrarService } from './Cifrar.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SesionService {
  //private usuarioLogueado : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);;
  //private sesion: Sesion;

  private sesionAct = new Subject<boolean>();
  refreshSesion$ = this.sesionAct.asObservable();

  sesionActiva: boolean;
  sesion: any;
  constructor(private cifrarService: CifrarService) {
    if (localStorage.getItem('sesionActiva')) {

      if (this.cifrarService.getDec(localStorage.getItem('sesionActiva')) == true) {
        this.sesionActiva = this.cifrarService.getDec(localStorage.getItem('sesionActiva'));
        this.sesion = this.cifrarService.getDec(localStorage.getItem('sesion'));
        console.log("sesion" , this.sesion)
        this.sesionAct.next(true);
      }
    }
  }

  /*=========== Apartado de Token para el consumo de ws ========= */

  getTokenWs() {
    return this.cifrarService.getDec(localStorage.getItem('tokenWs'));
  }

  setTokenWs(token: any) {
    let tokenDate = {
      fechaToken: new Date(),
      token: token
    };
    localStorage.setItem('tokenWs', this.cifrarService.setEnc(tokenDate));
  }

  /*=========== Apartado de Sesion para el control de la app ========= */

  setSesion(sesion: any) {

    localStorage.setItem('sesion', this.cifrarService.setEnc(sesion));
    localStorage.setItem('sesionActiva', this.cifrarService.setEnc(true));
    this.setTokenWs(sesion.tokenWs)
    this.sesion = sesion;
    this.sesionActiva = true;
    this.sesionAct.next(true);
  }

  getSesion() {
    return this.cifrarService.getDec(localStorage.getItem('sesion'));
  }

  resetDataSesion() {
    localStorage.clear();
    this.sesion = {};
    this.sesionActiva = false;
  }

  cerrarSesion() {
    this.resetDataSesion();
    this.sesionAct.next(false);
  }
}
