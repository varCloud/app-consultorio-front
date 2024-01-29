import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { typeWithParameters } from '@angular/compiler/src/render3/util';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CatalogoService } from 'src/app/servicios/catalogo/catalogo.service';
import { SimService } from 'src/app/servicios/sim/sim.service';
import { UsuarioService } from 'src/app/servicios/usuario/usuario.service';
import { SesionService } from 'src/app/utils/sesion.service';
import { EnumTipoToast, ToastService } from 'src/app/utils/toast.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-mdl-registrar-sim',
  templateUrl: './mdl-registrar-sim.component.html',
  styleUrls: ['./mdl-registrar-sim.component.scss']
})
export class MdlRegistrarSimComponent implements OnInit {

  @ViewChild("modalRegistrarSim") contentModal: Element;
  model: any;
  @Input() set AbrirModal(model: any) {
    this.model = model;
    if (model.abrir) this.abrirModal();
  }

  @Output() cerrarModal = new EventEmitter<any>();

  formRegistro: FormGroup;
  lstProductos = [];
  lstMvnos = [];
  lstAsignacion = [];
  lstEstatusSim = [];
  esAdministrador = false;
  esShowPass = false;
  tituloModal = "";
  constructor(
    private modalService: NgbModal,
    public formBuilder: FormBuilder,
    private toast: ToastService,
    private catalogoService: CatalogoService,
    private usuarioService: UsuarioService,
    public sesionService: SesionService,
    private simService: SimService
  ) { }

  ngOnInit(): void {

  }

  onInitForm() {
    this.tituloModal = "Registro"
    this.formRegistro = this.formBuilder.group({
      idUsuario: [this.sesionService.sesion.idUsuario],
      idTipoUsuario: [''],
      idMvno: ['', [Validators.required]],
      idUsuarioAlta: [this.sesionService.sesion.idUsuario],
      idSim: ['0'],
      beId: ['', Validators.required],
      imsi: ['', Validators.required],
      imsi_rb1: ['', Validators.required],
      imsi_rb2: ['', Validators.required],
      iccId: ['', Validators.required],
      msisdn: ['', Validators.required],
      pin: ['', Validators.required],
      puk: ['', Validators.required],
      serie: ['', Validators.required],
      idProduct: ['', Validators.required],
      idEstatusSim: ['', Validators.required],
      idEstatusAsignacionSim: ['', Validators.required],

    });

    if (!environment.production) {
      this.formRegistro.patchValue({
        telefono: "4433740472",
        correo: "var@pagaphone.com"
      })
    }

    if (this.model.editar || this.model.ver) {
      this.formRegistro.patchValue({
        idUsuarioAlta: [this.sesionService.sesion.idUsuario],
        idSim: this.model.idSim,
        beId: this.model.beId,
        imsi: this.model.imsi,
        imsi_rb1: this.model.imsiRb1,
        imsi_rb2: this.model.imsiRb2,
        iccId: this.model.icc,
        msisdn: this.model.msisdn,
        pin: this.model.pin,
        puk: this.model.puk,
        serie: this.model.serie,
        idEstatusSim: this.model.idEstatusSim,
        idEstatusAsignacionSim: this.model.idEstatusAsignacionSim,
      })
      this.tituloModal = "Actualizar Registro"
    }

    if (this.model.ver) {
      this.formRegistro.disable();
      this.tituloModal = "Registro: "
    }
  }

  get frmRegistro() {
    return this.formRegistro.controls;
  }

  abrirModal() {
    this.lstAsignacion =  JSON.parse(JSON.stringify(this.model.lstAsignacion))
    this.lstEstatusSim =  JSON.parse(JSON.stringify(this.model.lstEstatusSim))
    this.lstAsignacion.shift()
    this.lstEstatusSim.shift()
    
    this.onInitForm();
    setTimeout(() => {
      this.obtenerProductosSim();
      this.obtenerMvno();
    }, 300);
    this.modalService.open(this.contentModal, { centered: true, backdrop: 'static', keyboard: false }).result.then((result) => {
      if (result == 'guardar sim') {
        this.guardarSim();
      } else {
        this.cerrarModal.next(undefined);
      }
    }).catch((res) => { });

  }

  onShowPass() {
    if (this.frmRegistro.contrasena.enabled)
      this.esShowPass = !this.esShowPass
  }

  //#region  WEB SERVIES
  obtenerProductosSim() {
    this.simService.consultarProductosSim({}).subscribe((data: any) => {
      if (data.estatus == 200) {
        this.lstProductos = data.modelo
        this.frmRegistro.idProduct.setValue(this.model.idProducto)
      }
    })

  }
  
  obtenerMvno() {
    this.catalogoService.obtenerMvno().subscribe((data: any) => {
      if (data.estatus == 200) {
        this.lstMvnos = data.modelo;
        if (this.lstMvnos.length == 1) {
          this.frmRegistro.idMvno.setValue(this.sesionService.sesion.idMvno)
          this.frmRegistro.beId.setValue(this.lstMvnos[0].businessEntity)
          this.frmRegistro.idMvno.disable();
        }
      } else {
        this.toast.mostrar(data.mensaje, EnumTipoToast.info)
      }
    }, err => {
      this.toast.mostrar(err, EnumTipoToast.error)
    })
  }

  guardarSim() {
    if (this.formRegistro.valid) {
      this.frmRegistro.idMvno.enable();
      this.frmRegistro.beId.enable();
      this.simService.registrarEditarSim(this.formRegistro.value).subscribe((data: any) => {
        if (data.estatus == 200) {
          this.toast.mostrar(data.mensaje, EnumTipoToast.success)
          this.cerrarModal.next({ estatus: 200, mensaje: "", model: data.modelo });
        } else {
          this.toast.mostrar(data.mensaje, EnumTipoToast.info)
        }
        //modal.close()
      }, err => {
        this.toast.mostrar(err, EnumTipoToast.error)
        //modal.close()
      })
    }
  }
  //#endregion

}
