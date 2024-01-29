import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { EnumTipoUsuario } from 'src/app/entidades/enumeraciones';
import { UsuarioService } from 'src/app/servicios/usuario/usuario.service';
import { SesionService } from 'src/app/utils/sesion.service';
import { EnumTipoToast, ToastService } from 'src/app/utils/toast.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-operador',
  templateUrl: './operador.component.html',
  styleUrls: ['./operador.component.scss']
})
export class OperadorComponent implements OnInit {
  //variables para el componente de registro
  model: any = { abrir: false };

  //variables para el componente de cambiar contrasena
  modelContrasena: any = { abrir: false };

  //variables para el componente de edicion
  abrirModalEditar: boolean = false;

  mvno: any;
  lstUsuarios = []
  ColumnMode = ColumnMode;
  loaderTable = true;
  filteredData: any = [];

  constructor(private modalService: NgbModal,
    private sesionService: SesionService,
    private usuarioService: UsuarioService,
    private toastService: ToastService

  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.obtenerUsuarios();
    }, 1000)
  }


  //#region EVENTOS
  onAbrirModalRegistro() {
    this.model = { abrir: true, editar: false };
  }

  onAbrirModalCambiarContrasena(data){
    this.modelContrasena = { abrir: true , ...data};
  }

  onCerrarModalRegistro(data) {
    if (data) {
      if (data.estatus == 200) {
        this.obtenerUsuarios();
      }
    }
    this.model.abrir = false;
  }

  onCerrarModalContrasena(data) {
    if (data) {
      if (data.estatus == 200) {
        this.obtenerUsuarios();
        this.updateFilter('');
      }
    }
    this.model.abrir = false;
  }

  onEditar(item) {
    this.model = { abrir: true, ...item, editar: true }
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

  onVer(item) {
    this.model = { abrir: true, ...item, editar: false ,ver: true }
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
      '' +
        item.usuario
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
    this.loaderTable = true;
    let postData = { idTipoUsuario: EnumTipoUsuario.Operador }
    this.usuarioService.obtenerUsuariosPorUsuario(postData).subscribe((data: any) => {
      if (data.estatus == 200) {
        this.lstUsuarios = data.modelo;
        this.crearFiltro();
      }
      this.loaderTable = false
    }, err => {
      this.loaderTable = false
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
  //#endregion

}



