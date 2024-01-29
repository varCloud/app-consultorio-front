import { NavegacionService } from './../../../servicios/navegacion/navegacion.service';
import { SesionService } from 'src/app/utils/sesion.service';
import { Component, OnInit, ViewChild, ElementRef, Inject, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private router: Router,
    public sesionService: SesionService,
    private navegacionService:NavegacionService
  ) { }

  ngOnInit(): void {

    console.log("nombre",this.sesionService.sesion.nombre);
  }

  /**
   * Sidebar toggle on hamburger button click
   */
  toggleSidebar(e) {
    e.preventDefault();
    this.document.body.classList.toggle('sidebar-open');
  }

  /**
   * Logout
   */
  onLogout(e) {
    e.preventDefault();
    this.sesionService.resetDataSesion();
    if (!this.sesionService.sesionActiva) {
      this.router.navigate(['/auth/login']);
    }
  }

}
