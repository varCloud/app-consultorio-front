import { ColoresService } from './../../../../utils/colores.service';
import { CatalogoService } from './../../../../servicios/catalogo/catalogo.service';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { EnumTipoUsuario } from 'src/app/entidades/enumeraciones';
import { UsuarioService } from 'src/app/servicios/usuario/usuario.service';
import { SesionService } from 'src/app/utils/sesion.service';
import { ToastService, EnumTipoToast } from 'src/app/utils/toast.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-asignacion-de-sims',
  templateUrl: './asignacion-de-sims.component.html',
  styleUrls: ['./asignacion-de-sims.component.scss']
})
export class AsignacionDeSimsComponent implements OnInit {

  model: any = { abrir: false };

  modelSimsAsignadas: any = { abrir: false };

  modelSimsEditarAsignadas: any = { abrir: false };


  mvno: any;
  lstUsuarios = []
  tiposUsuarios = []
  idTipoUsuario
  ColumnMode = ColumnMode;
  loaderTable=true;
  filteredData: any = [];
  limitRows=20

  constructor(private modalService: NgbModal,
    private sesionService: SesionService,
    private usuarioService: UsuarioService,
    private toastService: ToastService,
    private catalogoService:CatalogoService,
    private toast: ToastService,
    public coloresService:ColoresService

  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.obtenerUsuarios();
      this.obtenerTiposUsuarios();
    }, 1000)
  }

  ngAfterViewInit(): void {
  }


  //#region EVENTOS

  onAbrirModalAsignarSim(item) {
    this.model={ abrir: true,  editar: false , ... item};
  }

 
  onCerrarModalRegistro(data) {
    if (data) {
      if (data.estatus == 200) {
        this.obtenerUsuarios();
      }
    }
    this.model.abrir = false;
  }

  onCerrarModalSimsAsignadas(data){

  }

  onCerrarModaEditarSimsAsignadas(data){

  }

   onEditarSimsAsigndas(item) {
      this.modelSimsEditarAsignadas = { abrir: true, ...item, editar: true ,ver: false }
  }

  onVerSimsAsigndas(item) {
    this.modelSimsAsignadas = { abrir: true, ...item, editar: false , ver: true }
  }
  onDesactivar(item) {
    Swal.fire({
      title: 'Estas seguro que desea eliminar el registro?',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      icon: 'question',
    }).then((result) => {
      if (result.isConfirmed) {
        this.desactivarUsuario(item)
      }
    })
  }



  crearFiltro() {
    this.filteredData = this.lstUsuarios
    this.filteredData.map((item: any) => {
      item.filtro =
        item.nombreCompleto +
        '' +
        item.idUsuario +
        '' +
        item.correo
    });
  }

  updateFilter(value: any) {
    if (value === '') {
      this.filteredData = this.lstUsuarios;
    } {
      const filtered = this.lstUsuarios.filter((data: any) => {
        return data.filtro.toLowerCase().includes(value.toLowerCase());
      });
      this.filteredData = filtered
    }

  }

  //#endregion EVENTOS

  //#region  WEB SERVICES
  obtenerUsuarios() {
    let postData = { idTipoUsuario: this.idTipoUsuario}
    this.usuarioService.obtenerUsuariosPorUsuario(postData).subscribe((data: any) => {
      if (data.estatus == 200) {
        this.lstUsuarios = data.modelo;
        this.crearFiltro();
      }
      this.loaderTable=false;
    },err=>{
      this.loaderTable=false;
      this.toast.mostrar(err.message, EnumTipoToast.error)
    })
  }

  desactivarUsuario(item) {
    let postData = { idUsuario: item.idUsuario, estatus: 0 }
    this.usuarioService.actualizarEstadoUsuario(postData).subscribe((data: any) => {
      if (data.estatus == 200) {
        this.toastService.mostrar(data.mensaje, EnumTipoToast.success)
      } else {
        this.toastService.mostrar(data.mensaje, EnumTipoToast.info)
      }
    }, err => {
      this.toastService.mostrar(err.message, EnumTipoToast.error)
    })
  }

  obtenerTiposUsuarios() {
    this.catalogoService.obtenerTiposUsuariosPorRol({}).subscribe((data: any) => {
      if (data.estatus == 200) {
        this.tiposUsuarios = data.modelo;
        this.tiposUsuarios.unshift({ "idTipoUsuario": 0, "descripcion": "Todos" })
        this.idTipoUsuario = 0;

      } else {
        this.toast.mostrar(data.mensaje, EnumTipoToast.info)
      }
    }, err => {
      this.toast.mostrar(err.message, EnumTipoToast.error)
    })
  }

  //#endregion

}
