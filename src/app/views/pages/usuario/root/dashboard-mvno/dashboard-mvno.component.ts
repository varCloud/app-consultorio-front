import { CifrarService } from 'src/app/utils/Cifrar.service';
import { Router } from '@angular/router';
import { CatalogoService } from 'src/app/servicios/catalogo/catalogo.service';
import { EnumTipoToast, ToastService } from 'src/app/utils/toast.service';
import { Component, OnInit } from '@angular/core';
import { SesionService } from 'src/app/utils/sesion.service';

@Component({
  selector: 'app-dashboard-mvno',
  templateUrl: './dashboard-mvno.component.html',
  styleUrls: ['./dashboard-mvno.component.scss']
})
export class DashboardMvnoComponent implements OnInit {


  lstMvnos = [];


  constructor(
    private router: Router,
    private toast: ToastService,
    private catalogoService: CatalogoService,
    private sesionService: SesionService,
    private cifrarService: CifrarService) { }


  ngOnInit(): void {
    this.obtenerMvno();
  }


  obtenerMvno() {
    this.catalogoService.obtenerMvno().subscribe((data: any) => {
      if (data.estatus == 200) {
        this.lstMvnos = data.modelo;
      } else {
        this.toast.mostrar(data.mensaje, EnumTipoToast.info)
      }
    }, err => {
      this.toast.mostrar(err, EnumTipoToast.error)
    })
  }

  onIngresar(mvno){
    let sesion = this.sesionService.getSesion();
    sesion.idMvno = mvno.idMvno;
    this.sesionService.setSesion(sesion);
  }

}
