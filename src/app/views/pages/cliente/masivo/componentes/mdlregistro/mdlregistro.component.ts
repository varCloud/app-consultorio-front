import { ClienteService } from './../../../../../../servicios/cliente/cliente.service';
import { CatalogoService } from 'src/app/servicios/catalogo/catalogo.service';
import { EnumTipoToast, ToastService } from "./../../../../../../utils/toast.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Component, OnInit, ViewChild, Input, Output, EventEmitter, } from "@angular/core";

@Component({
  selector: "app-mdlregistro",
  templateUrl: "./mdlregistro.component.html",
  styleUrls: ["./mdlregistro.component.scss"],
})
export class MdlregistroComponent implements OnInit {
  @ViewChild("modalRegistro") contentModal: Element;

  //Variables del componente
  @Input() set AbrirModal(abrir: boolean) {
    if (abrir) this.abrirModal();
  }
  @Input() set SetData(data: any) {
    if (data) {
      this.formRegistro.patchValue(data.cliente);
      this.codigoPostal = data.cliente.codigoPostal
      this.habilitarForm = data.habilitarForm;
      this.tituloModal= "Actualizar datos de " + (this.idCorporativo==0 ? "cliente":"colaborador")
      if (this.habilitarForm == false) {//consulta de cliente
        this.formRegistro.disable();
        this.tituloModal= "Datos de " + (this.idCorporativo==0 ? "cliente":"colaborador")
      }
    }
  }

  //indica el id del cliente corporativo en caso de usar este modal para registrar colaboradores de un corporativo
  @Input() idCorporativo=0;

  @Output() cerrarModal = new EventEmitter<any>();

  //Variables para el formulario
  tituloModal;
  habilitarForm: boolean;
  formRegistro: FormGroup;
  colonias;
  codigoPostal

  constructor(
    private modalService: NgbModal,
    public formBuilder: FormBuilder,
    private toast: ToastService,
    private catalogoService: CatalogoService,
    private clienteService: ClienteService
  ) { }

  ngOnInit(): void {
    this.onInitForm();
  }

  //#region  Funciones del componente
  abrirModal() {
    this.modalService
      .open(this.contentModal, {
        centered: true,
        backdrop: "static",
        keyboard: false,
        size: "xl",
      })
      .result.then((result) => {
        this.cerrarModal.next(undefined);
      })
      .catch((res) => { });
    this.resetForm();
  }

  resetForm() {
    this.codigoPostal = undefined;
    this.formRegistro.reset();
    this.colonias = [];
    this.habilitarForm = true;
    this.formRegistro.enable();
    this.tituloModal = "Registro de " + (this.idCorporativo==0 ? "cliente":"colaborador");
    this.formRegistro.patchValue({idClienteCorporativo: this.idCorporativo})
  }
  //#endregion Funciones del componente

  //#region INICIALIZACIONES
  onInitForm() {
    this.formRegistro = this.formBuilder.group({
      idClienteMasivo: [""],
      idClienteCorporativo: [""],
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
  //#endregion INICIALIZACIONES

  //#region WEB SERVICES
  obtenerDireccionCP(codigoPostal) {
    if (codigoPostal && codigoPostal.toString().trim().length == 5) {
      this.catalogoService.obtenerDireccionCP({ codigoPostal: codigoPostal }).subscribe(response => {
        this.successObtenerColonias(response);
      },
        error => {
          console.log(JSON.stringify(error));
        })
    }
  }

  successObtenerColonias(data) {
    if (data.estatus == 200) {
      this.colonias = data.modelo.colonias;
      this.formRegistro.patchValue({ "estado": data.modelo.direccion.estado });
      this.formRegistro.patchValue({ "municipio": data.modelo.direccion.municipio });
    }
  }
  //#endregion WEB SERVICES

  //#region EVENTOS
  onGuardar(modal) {
    if (this.formRegistro.valid) {
      this.clienteService.registrarClienteMasivo(this.formRegistro.value).subscribe((data: any) => {
        if (data.estatus == 200) {
          this.toast.mostrar(data.mensaje, EnumTipoToast.success)
          this.cerrarModal.next({ status: 200, mensaje: "", model: data.modelo });
          modal.close();
        } else {
          this.toast.mostrar(data.mensaje, EnumTipoToast.info)
        }
      }, err => {
        console.log(err)
        this.toast.mostrar(err, EnumTipoToast.error);
      })
    }
  }
  //#endregion EVENTOS
}
