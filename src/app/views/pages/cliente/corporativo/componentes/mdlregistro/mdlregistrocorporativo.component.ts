import { ClienteService } from '../../../../../../servicios/cliente/cliente.service';
import { CatalogoService } from 'src/app/servicios/catalogo/catalogo.service';
import { EnumTipoToast, ToastService } from "../../../../../../utils/toast.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Component, OnInit, ViewChild, Input, Output, EventEmitter, } from "@angular/core";

@Component({
  selector: 'app-mdlregistro-corporativo',
  templateUrl: './mdlregistrocorporativo.component.html',
  styleUrls: ['./mdlregistrocorporativo.component.scss']
})
export class MdlregistroCorporativoComponent implements OnInit {
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
      this.tituloModal= "Actualizar datos de cliente";
      if(this.habilitarForm == false){//consulta de cliente
        this.formRegistro.disable();
        this.tituloModal= "Datos de cliente";
      }
    }
  }
  @Output() cerrarModal = new EventEmitter<any>();

  //Variables para el formulario
  habilitarForm:boolean;
  tituloModal;
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

  resetForm(){
    this.codigoPostal = undefined;
    this.formRegistro.reset();
    this.colonias=[];
    this.habilitarForm = true;
    this.formRegistro.enable();
    this.tituloModal = "Registro de cliente";
  }
  //#endregion Funciones del componente

  //#region INICIALIZACIONES
  onInitForm() {
    this.formRegistro = this.formBuilder.group({
      idClienteCorporativo: [""],
      razonSocial: ["", Validators.required],
      rfc: ["", Validators.required],
      telefono: [""],
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
      this.clienteService.registrarClienteCorporativo(this.formRegistro.value).subscribe((data: any) => {
        if (data.estatus == 200) {
          this.toast.mostrar(data.mensaje, EnumTipoToast.success)
          this.cerrarModal.next({ status: 200, mensaje: "", model: data.modelo });
          modal.close();
        } else {
          this.toast.mostrar(data.mensaje, EnumTipoToast.info)
        }
      }, err => {
        console.log(err)
        this.toast.mostrar(err, EnumTipoToast.error)
        //modal.close()
      })
    }
  }
  //#endregion EVENTOS
}
