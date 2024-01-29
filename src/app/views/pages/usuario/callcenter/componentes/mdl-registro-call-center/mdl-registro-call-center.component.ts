import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CatalogoService } from 'src/app/servicios/catalogo/catalogo.service';
import { UsuarioService } from 'src/app/servicios/usuario/usuario.service';
import { SesionService } from 'src/app/utils/sesion.service';
import { EnumTipoToast, ToastService } from 'src/app/utils/toast.service';
import { EnumTipoUsuario } from 'src/app/entidades/enumeraciones';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-mdl-registro-call-center',
  templateUrl: './mdl-registro-call-center.component.html',
  styleUrls: ['./mdl-registro-call-center.component.scss']
})
export class MdlRegistroCallCenterComponent implements OnInit {


  @ViewChild("modalRegistro") contentModal: Element;
  model: any;
  @Input() set AbrirModal(model: any) {
    this.model = model;
    if (model.abrir) this.abrirModal();
  }

  @Output() cerrarModal = new EventEmitter<any>();

  formRegistro: FormGroup;
  tiposUsuarios = [];
  lstMvnos = [];
  esAdministrador = false;
  esShowPass = false;
  tituloModal = "";
  constructor(
    private modalService: NgbModal,
    public formBuilder: FormBuilder,
    private toast: ToastService,
    private catalogoService: CatalogoService,
    private usuarioService: UsuarioService,
    public sesionService: SesionService) { }

  ngOnInit(): void {

  }

  onInitForm() {
    this.tituloModal = "Registro"
    this.formRegistro = this.formBuilder.group({
      idUsuario: [0],
      idTipoUsuario: ['', [Validators.required]],
      idMvno: ['', [Validators.required]],
      idUsuarioAlta: [this.sesionService.sesion.idUsuario],
      nombreCompleto: ['', Validators.required],
      us: ['', Validators.required],
      contrasena: ['', Validators.required],
      telefono: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
    });

    if (!environment.production) {
      this.formRegistro.patchValue({
        telefono: "4433740472",
        correo: "var@pagaphone.com"
      })
    }

    if (this.model.editar || this.model.ver) {
      this.formRegistro.patchValue({
        idUsuario: this.model.idUsuario,
        idTipoUsuario: this.model.idTipoUsuario,
        idMvno: this.model.idMvno,
        nombreCompleto: this.model.nombreCompleto,
        us: this.model.usuario,
        contrasena: this.model.contrasena,
        telefono: this.model.telefono,
        correo: this.model.correo,
      })
      this.frmRegistro.contrasena.disable();
      this.tituloModal = "Actualizar Registro"
    }

    if (this.model.ver) {
      this.formRegistro.disable();
      this.tituloModal = "Registro: " +this.model.nombreCompleto+" ("+this.model.usuario+")"
    }
  }

  get frmRegistro() {
    return this.formRegistro.controls;
  }


  abrirModal() {
    this.onInitForm();
    setTimeout(() => {
      this.obtenerTiposUsuarios();
      this.obtenerMvno();
    }, 300);
    this.modalService.open(this.contentModal, { centered: true, backdrop: 'static', keyboard: false }).result.then((result) => {
      this.cerrarModal.next(undefined);
    }).catch((res) => { });

  }

  onGuardar(modal) {
    if (this.formRegistro.valid) {
      this.frmRegistro.idMvno.enable();
      this.frmRegistro.idTipoUsuario.enable();
      this.usuarioService.registrarUsuario(this.formRegistro.value).subscribe((data: any) => {
        if (data.estatus == 200) {
          this.toast.mostrar(data.mensaje, EnumTipoToast.success)
          this.cerrarModal.next({ estatus: 200, mensaje: "", model: data.modelo });
        } else {
          this.toast.mostrar(data.mensaje, EnumTipoToast.info)
        }
        modal.close()
      }, err => {
        this.toast.mostrar(err, EnumTipoToast.error)
        modal.close()
      })
    }
  }

  onShowPass() {
    if (this.frmRegistro.contrasena.enabled)
      this.esShowPass = !this.esShowPass
  }

  //#region  WEB SERVIES

  obtenerTiposUsuarios() {
    this.catalogoService.obtenerTiposUsuariosPorRol({}).subscribe((data: any) => {
      if (data.estatus == 200) {
        this.tiposUsuarios = data.modelo;
        this.tiposUsuarios.unshift({ "idTipoUsuario": "", "descripcion": "Seleccione un Rol" })
        this.frmRegistro.idTipoUsuario.setValue(EnumTipoUsuario.Soporte_Técnico)
        this.frmRegistro.idTipoUsuario.disable();

      } else {
        this.toast.mostrar(data.mensaje, EnumTipoToast.info)
      }
    }, err => {
      this.toast.mostrar(err, EnumTipoToast.error)
    })
  }

  obtenerMvno() {
    this.catalogoService.obtenerMvno().subscribe((data: any) => {
      if (data.estatus == 200) {
        this.lstMvnos = data.modelo;
        if (this.lstMvnos.length == 1) {
          this.frmRegistro.idMvno.setValue(this.sesionService.sesion.idMvno)
          this.frmRegistro.idMvno.disable();
        }
      } else {
        this.toast.mostrar(data.mensaje, EnumTipoToast.info)
      }
    }, err => {
      this.toast.mostrar(err, EnumTipoToast.error)
    })
  }
  //#endregion

}
