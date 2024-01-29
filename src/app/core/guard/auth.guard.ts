import { CifrarService } from './../../utils/Cifrar.service';

import { Injectable } from '@angular/core';
import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Router } from '@angular/router';


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router,
    private cifrarService: CifrarService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log("sesionActiva", this.cifrarService.getDec(localStorage.getItem("sesionActiva")))
    if ( this.cifrarService.getDec(localStorage.getItem("sesionActiva")) ==true) {
      console.log("sesionActiva", this.cifrarService.getDec(localStorage.getItem("sesionActiva")))
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
