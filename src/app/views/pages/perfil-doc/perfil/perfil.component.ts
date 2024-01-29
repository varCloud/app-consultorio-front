import { EnumTipoToast, ToastService } from 'src/app/utils/toast.service';
import { UsuarioService } from 'src/app/servicios/usuario/usuario.service';
import { SesionService } from 'src/app/utils/sesion.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  colorFondoEncabezados = '#393d42'
  colorTextoDoctor = '#000000'
  colorTituloEncabezados = '#ffffff'
  colorCotenido = '#777777'
  formPerfil: FormGroup
  constructor(
    public formBuilder: FormBuilder,
    public sesionService: SesionService,
    private usuarioService: UsuarioService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {

    this.formPerfil = this.formBuilder.group({
      colorCotenido: [''],
      colorFondoEncabezados: [''],
      colorFondoContenido: [''],
      colorTextoDoctor: [''],
      colorTituloEncabezados: [''],
    });
  }

  get frmPerfil() {
    return this.formPerfil.controls
  }

  public onEventLog(event: string, data: any): void {
    console.log(event, data);
  }

  public onChangeColor(color: string): void {
    console.log('Color changed:', color);
  }

  /*************WEB SERVICES*********************** */
  guardar() {
    if (this.formPerfil.valid) {

      this.sesionService.setSesion(this.sesionService.sesion)
      this.usuarioService.actualizarPerfilUsuario(this.sesionService.sesion).subscribe((data: any) => {
        this.toastService.mostrar(data.mensaje, EnumTipoToast.success)
      })
    }
  }
}
