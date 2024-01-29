import { SimService } from './../../../../servicios/sim/sim.service';
import { ClienteService } from './../../../../servicios/cliente/cliente.service';
import { EnumTipoToast, ToastService } from 'src/app/utils/toast.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { SesionService } from 'src/app/utils/sesion.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-mdlsimcliente',
  templateUrl: './mdlsimcliente.component.html',
  styleUrls: ['./mdlsimcliente.component.scss']
})
export class MdlsimclienteComponent implements OnInit {
  @ViewChild("modalSIM") contentModal: Element;

  //Variables del componente
  @Input() set AbrirModal(abrir: boolean) {
    this.visible = abrir;
    if (abrir) this.abrirModal();
  }
  @Input() set SetData(data: any) {
    if (data && this.visible) {
      this.cliente = data.cliente;
      this.formRegistro.patchValue(this.cliente);
      this.onInitDataSims();
    }
  }
  @Output() cerrarModal = new EventEmitter<any>();

  //Variables del modal
  visible: boolean;
  tituloModal;
  cliente;

  //Variables para el formulario
  habilitarForm: boolean;
  formRegistro: FormGroup;

  //tabla de sims de clientes
  simsCliente;
  loaderTablaSimsCliente;

  //tabla de sims para asignar
  simsPorAsignar;
  loaderTablaSimsPorAsignar;
  simsFiltrados: any = [];

  constructor(
    private modalService: NgbModal,
    public formBuilder: FormBuilder,
    private toast: ToastService,
    private sesionService: SesionService,
    private clienteService: ClienteService,
    private simService: SimService
  ) { }

  ngOnInit(): void {
    this.onInitForm();
  }

  //#region  Funciones del componente
  abrirModal() {
    this.modalService.open(this.contentModal, { centered: true, backdrop: "static", keyboard: false, size: "xl", }).result.then((result) => {
      this.cerrarModal.next(undefined);
    }).catch((res) => { });
    this.resetForm();
  }

  resetForm() {
    this.formRegistro.reset();
    this.tituloModal = "Asignación de SIM";
  }
  //#endregion Funciones del componente

  //#region INICIALIZACIONES
  onInitForm() {
    this.formRegistro = this.formBuilder.group({
      idClienteMasivo: [""],
      nombres: ["", Validators.required],
      primerApellido: ["", Validators.required],
      segundoApellido: [""],
      fechaNacimiento: ["", Validators.required],
      telefonoAdicional: [""],
      curp: [""],
      correo: ["", [Validators.email]],
      /*datos de dirección*/
      codigoPostal: ["", [Validators.required, Validators.minLength(5)]],
      estado: ["", Validators.required],
      municipio: ["", Validators.required],
      idColonia: ["", Validators.required],
      calle: ["", Validators.required],
      numeroExterior: ["", Validators.required],
      numeroInterior: [""],
    });
  }

  get frmRegistro() {
    return this.formRegistro.controls;
  }

  onInitDataSims() {
    this.simsCliente = [];
    this.simsPorAsignar = [];
    this.obtenerSimsClienteMasivo(this.cliente);
    this.obtenerSimUsuario({ idUsuario: this.sesionService.sesion.idUsuario })
  }
  //#endregion INICIALIZACIONES

  //#region FUNCIONES INTERNAS
  crearFiltro() {
    this.simsFiltrados = this.simsPorAsignar
    this.simsFiltrados.map((item: any) => {
      item.filtro =
        item.msisdn +
        ' ' +
        item.icc +
        ' ' +
        item.imsi
    });
  }
  //#endregion FUNCIONES INTERNAS

  //#region WEB SERVICES

  obtenerSimsClienteMasivo(postData) {
    this.loaderTablaSimsCliente = true;
    this.clienteService.obtenerSimsClienteMasivo(postData).subscribe((data: any) => {
      this.onSuccessObtenerSimsClienteMasivo(data);
      this.loaderTablaSimsCliente = false;
    }, err => {
      this.toast.mostrar(err.message, EnumTipoToast.error);
      this.loaderTablaSimsCliente = false;
    })
  }

  onSuccessObtenerSimsClienteMasivo(data) {
    if (data.estatus == 200) {
      this.simsCliente = data.modelo;
    }
  }

  obtenerSimUsuario(postData) {
    this.loaderTablaSimsPorAsignar = true;
    this.simService.obtenerSimUsuario(postData).subscribe((data: any) => {
      this.onSuccessObtenerSimUsuario(data);
      this.loaderTablaSimsPorAsignar = false;
    }, err => {
      this.toast.mostrar(err.message, EnumTipoToast.error);
      this.loaderTablaSimsPorAsignar = false;
    })
  }

  onSuccessObtenerSimUsuario(data) {
    if (data.estatus == 200) {
      this.simsPorAsignar = data.modelo.length > 0 ? data.modelo.filter(x => x.idEstatusSim == 1) : data.modelo;
      this.crearFiltro();
    }
  }

  asignarSim(postData) {
    this.clienteService.asignarSimClienteMasivo(postData).subscribe((data: any) => {
      this.onSuccessAsignarSim(data);
    }, err => {
      this.toast.mostrar(err.message, EnumTipoToast.error);
    })
  }

  onSuccessAsignarSim(data) {
    if (data.estatus == 200) {
      this.onInitDataSims()
      this.toast.mostrar(data.mensaje, EnumTipoToast.success)
    } else {
      this.toast.mostrar(data.mensaje, EnumTipoToast.info)
    }
  }

  desvincularSim(postData) {
    this.clienteService.desvincularSimClienteMasivo(postData).subscribe((data: any) => {
      this.onSuccessDesvincularSim(data);
    }, err => {
      this.toast.mostrar(err.message, EnumTipoToast.error);
    })
  }

  onSuccessDesvincularSim(data) {
    if (data.estatus == 200) {
      this.onInitDataSims()
      this.toast.mostrar(data.mensaje, EnumTipoToast.success)
    } else {
      this.toast.mostrar(data.mensaje, EnumTipoToast.info)
    }
  }

  //#endregion WEB SERVICES

  //#region EVENTOS
  onAsignarSim(sim) {
    Swal.fire({
      title: 'Estas seguro que desea asignar el SIM?\nMSISDN: ' + sim.msisdn,
      confirmButtonText: 'Aceptar',
      //confirmButtonColor: "#ff3366",
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.asignarSim({ ...sim, ...this.cliente })
      }
    })
  }

  onDesvincularSim(sim){
    Swal.fire({
      title: '¿Estas seguro que desea desvincular  el SIM?',
      confirmButtonText: 'Si, desvincular',
      confirmButtonColor: "#ff3366",
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: "No"
    }).then((result) => {
      if (result.isConfirmed) {
        this.desvincularSim({ ...sim, ...this.cliente })
      }
    })
  }

  onActualizarFiltro(value: any) {
    if (value === '') {
      this.simsFiltrados = this.simsPorAsignar;
    } else {
      this.simsFiltrados = this.simsPorAsignar.filter((data: any) => {
        return data.filtro.toLowerCase().includes(value.toLowerCase());
      });
    }
  }
  //#endregion EVENTOS
}
