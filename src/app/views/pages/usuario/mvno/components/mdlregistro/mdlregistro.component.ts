import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EnumTipoToast, ToastService } from 'src/app/utils/toast.service';


@Component({
  selector: 'app-mdlregistro',
  templateUrl: './mdlregistro.component.html',
  styleUrls: ['./mdlregistro.component.scss']
})
export class MdlregistroComponent implements OnInit {

  @ViewChild("modalRegistro") contentModal: Element;

  @Input() set AbrirModal(abrir: boolean) {
    if (abrir) this.abrirModal();
  }

  @Output() cerrarModal = new EventEmitter<any>();

  formRegistro: FormGroup;

  constructor(
    private modalService: NgbModal,
    public formBuilder: FormBuilder,
    private toast: ToastService) { }

  ngOnInit(): void {
    this.onInitForm();
  }

  onInitForm() {
    this.formRegistro = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      userName: ['', Validators.required]
    });
  }

  get frmRegistro() {
    return this.formRegistro.controls;
  }


  abrirModal() {
    this.modalService.open(this.contentModal, { centered: true, backdrop: 'static', keyboard: false }).result.then((result) => {
      console.log("Cierre de modal");
      this.cerrarModal.next(undefined);
    }).catch((res) => { });
    this.formRegistro.reset();
  }


  onGuardar(modal) {
    if(this.formRegistro.valid){
      this.toast.mostrar("Exitoso",EnumTipoToast.success)
      //valida
      //consume el ws
      //Se muestra toast ó sweet de exitoso o error  al guardar
      modal.close()
      this.cerrarModal.next({ status: 200, mensaje: "", model: { id: 1, nombew: "Edson", rfc: "COCA" } });
    }else{
      this.toast.mostrar("Exitoso",EnumTipoToast.info)
    }
    
  }


}
