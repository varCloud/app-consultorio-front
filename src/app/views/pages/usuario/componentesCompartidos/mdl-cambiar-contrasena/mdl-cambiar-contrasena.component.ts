import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EnumTipoUsuario } from 'src/app/entidades/enumeraciones';
import { CatalogoService } from 'src/app/servicios/catalogo/catalogo.service';
import { UsuarioService } from 'src/app/servicios/usuario/usuario.service';
import { SesionService } from 'src/app/utils/sesion.service';
import { ToastService, EnumTipoToast } from 'src/app/utils/toast.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-mdl-cambiar-contrasena',
  templateUrl: './mdl-cambiar-contrasena.component.html',
  styleUrls: ['./mdl-cambiar-contrasena.component.scss']
})
export class MdlCambiarContrasenaComponent implements OnInit {


  @ViewChild("modalContrasena") contentModal: Element;
  model: any;
  @Input() set AbrirModal(model: any) {
    this.model = model;
    if (model.abrir) this.abrirModal();
  }

  @Output() cerrarModal = new EventEmitter<any>();

  formContrasena: FormGroup;
  esAdministrador = false;
  esShowPass = false;
  tituloModal = "";
  constructor(
    private modalService: NgbModal,
    public formBuilder: FormBuilder,
    private toast: ToastService,
    private usuarioService: UsuarioService,
    public sesionService: SesionService) { }

  ngOnInit(): void {

  }
  //#region  Eventos
  onInitForm() {
    this.tituloModal = "Cambiar Contrasena: "+ this.model.usuario;
    this.formContrasena = this.formBuilder.group({
      idUsuario: [this.model.idUsuario],
      contrasena: ['', Validators.required],
      contrasena_confirm: ['', Validators.required]
    }, {
      validator: this.passwordConfirmin('contrasena', 'contrasena_confirm')
    });

  }

  passwordConfirmin(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        // return if another validator has already found an error on the matchingControl
        return;
      }
      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ passwordConfirmin: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }
  get frmContrasena() {
    return this.formContrasena.controls;
  }


  abrirModal() {
    console.log(this.model)
    this.onInitForm();
    this.modalService.open(this.contentModal, { centered: true, backdrop: 'static', keyboard: false }).result.then((result) => {
      console.log("Cierre de modal");
      this.cerrarModal.next(undefined);
    }).catch((res) => { });

  }

  onShowPass() {
    if (this.frmContrasena.contrasena.enabled)
      this.esShowPass = !this.esShowPass
  }

  //#endregion

  //#region  WEB SERVICES
  onCambiar(modal) {
    if (this.formContrasena.valid) {
      this.usuarioService.cambiarContrasena(this.formContrasena.value).subscribe((data: any) => {
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
  //#endregion

}
