
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbDateStruct, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { EnumTipoUsuario } from 'src/app/entidades/enumeraciones';
import { UsuarioService } from 'src/app/servicios/usuario/usuario.service';
import { SesionService } from 'src/app/utils/sesion.service';
import { ToastService, EnumTipoToast } from 'src/app/utils/toast.service';
import Swal from 'sweetalert2';
import { MdlRegistraPacienteComponent } from '../componentes/mdl-registra-paciente/mdl-registra-paciente.component';
import { MdlHistoriaClinicaComponent } from '../componentes/mdl-historia-clinica/mdl-historia-clinica.component';
import { MdlUltimaNotaComponent } from '../../componentes-compartidos/mdl-ultima-nota/mdl-ultima-nota.component';


@Component({
  selector: 'app-paciente',
  templateUrl: './paciente.component.html',
  styleUrls: ['./paciente.component.scss']
})
export class PacienteComponent implements OnInit {
  color1 = "#727cf5";
  model: any = { abrir: false };

  //variables para el componente de edicion
  abrirModalEditar: boolean = false;

  //variables para el componente de cambiar contrasena
  modelContrasena: any = { abrir: false };
  mvno: any;
  lstPacientes = []
  loaderTable = true;
  filteredData: any = [];

  @ViewChild("mdlWizard") mdlWizard: Element;
  selectedDate: NgbDateStruct;
  showAge
  constructor(private modalService: NgbModal,
    private sesionService: SesionService,
    private usuarioService: UsuarioService,
    private toastService: ToastService,
    private router:Router,



  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.obtenerUsuarios();
    }, 1000)
  }

  ngAfterViewInit(): void {
  }

  onDateSelected() { }
  //#region EVENTOS
  onAbrirModalRegistro() {
    const modalRef = this.modalService.open(MdlRegistraPacienteComponent, { size: 'lg', centered: true, backdrop: 'static', keyboard: false })
    modalRef.componentInstance.modelo ={ paciente : {idPaciente:0} , abrir: true, modal: modalRef, editar: false, tituloModal: "Historia Clinica" };
    modalRef.result.then((result) => {
      this.obtenerUsuarios()
    }).catch((res) => { console.log("error al cerrar el modal", res) });
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
    const modalRef = this.modalService.open(MdlRegistraPacienteComponent, { size: 'lg', centered: true, backdrop: 'static', keyboard: false })
    modalRef.componentInstance.modelo ={ paciente : item , abrir: true, modal: modalRef, editar: true, tituloModal: "Editar Historia Clinica" };
    modalRef.result.then((result) => {
      console.log("close modal desde :::" , result)
      this.obtenerUsuarios();
    }).catch((res) => { console.log("error al cerrar el modal", res) });

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

    const modalRef = this.modalService.open(MdlHistoriaClinicaComponent, { size: 'xl', centered: true, backdrop: 'static', keyboard: false })
    modalRef.componentInstance.modelo ={ paciente : item , abrir: true, modal: modalRef, editar: true, tituloModal: "Editar Historia Clinica" };
    modalRef.result.then((result) => {
      console.log("close modal desde :::" , result)
      this.obtenerUsuarios();
    }).catch((res) => { console.log("error al cerrar el modal", res) });

  }

  crearFiltro() {
    this.filteredData = this.lstPacientes
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
      this.filteredData = this.lstPacientes;
    } {
      const filtered = this.lstPacientes.filter((data: any) => {
        return data.filtro.toLowerCase().includes(value.toLowerCase());
      });
      this.filteredData = filtered
    }

  }

  onAgregarNotaMedica(data) {
    console.log("item ",data)
    this.router.navigate(['notas/agregar-nota'],{queryParams:{idPaciente:data.idPaciente ,idNotaMedica:undefined , editar:true}})
  }

  onUltimaNotaMedica(data) {
      const modalRef = this.modalService.open(MdlUltimaNotaComponent,{size:'xl', centered: true, backdrop: 'static', keyboard: false })
      modalRef.componentInstance.idPaciente = data.idPaciente;
      modalRef.componentInstance.idNotaMedica = 0;
  }

  //#endregion EVENTOS

  //#region  WEB SERVICES
  obtenerUsuarios() {
    let postData = { idTipoUsuario: EnumTipoUsuario.Admin_MVNO }
    console.log(postData)
    this.usuarioService.obtenerPacientes(postData).subscribe((data: any) => {
      if (data.estatus == 200) {
        this.lstPacientes = data.modelo;
        this.crearFiltro();
      }
      this.loaderTable = false;
    }, err => {
      this.loaderTable = false;
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
