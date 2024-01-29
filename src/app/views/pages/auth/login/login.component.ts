import { EnumTipoUsuario } from 'src/app/entidades/enumeraciones';
import { CifrarService } from 'src/app/utils/Cifrar.service';
import { SesionService } from 'src/app/utils/sesion.service';
import { ToastService, EnumTipoToast } from 'src/app/utils/toast.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from 'src/app/servicios/login/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  submitform=false;
  returnUrl: any;
  public form: FormGroup;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private toastService: ToastService,
    private sesionService: SesionService,
    private cifrarService: CifrarService
  ) { }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.initForm();

  }

  onLoggedin(e) {
    e.preventDefault();
    let postData = {}
    if (this.form.valid) {
      this.form.patchValue({
        contrasena: this.cifrarService.generarContrasena(this.form.controls.contrasena.value)
      })
      this.submitform = true;
      this.loginService.login(this.form.value).subscribe((data: any) => {
        if (data.estatus == 200) {
          this.sesionService.setSesion(data.model)
          if (this.sesionService.sesionActiva) {
            this.router.navigate(["dashboard"]);
          }
        } else {
          this.form.controls.contrasena.setValue('')
          this.toastService.mostrar(data.mensaje, EnumTipoToast.info)
        }
        this.submitform = false;
      }, err => {
        this.submitform = false;
        this.form.controls.contrasena.setValue('')
        this.toastService.mostrar(err, EnumTipoToast.error)
      })
    }
  }

  private initForm() {
    this.form = this.formBuilder.group({
      contrasena: ['', Validators.required],
      usuario: ['', Validators.required],
      remember: false
    });
  }

}
