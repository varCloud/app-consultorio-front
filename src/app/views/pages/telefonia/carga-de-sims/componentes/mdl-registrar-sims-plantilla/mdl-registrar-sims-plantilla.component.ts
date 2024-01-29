import { SimService } from './../../../../../../servicios/sim/sim.service';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EnumTipoUsuario } from 'src/app/entidades/enumeraciones';
import { CatalogoService } from 'src/app/servicios/catalogo/catalogo.service';
import { UsuarioService } from 'src/app/servicios/usuario/usuario.service';
import { SesionService } from 'src/app/utils/sesion.service';
import { ToastService, EnumTipoToast } from 'src/app/utils/toast.service';
import { environment } from 'src/environments/environment';
import * as XLSX from 'xlsx';

type AOA = any[][];

@Component({
  selector: 'app-mdl-registrar-sims-plantilla',
  templateUrl: './mdl-registrar-sims-plantilla.component.html',
  styleUrls: ['./mdl-registrar-sims-plantilla.component.scss']
})
export class MdlRegistrarSimsPlantillaComponent implements OnInit {

  @ViewChild("modalCargaSimsPlantilla") contentModal: Element;
  model: any;
  dataExcel: any;
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
  archivoActual :File;
  constructor(
    private modalService: NgbModal,
    public formBuilder: FormBuilder,
    private toast: ToastService,
    private catalogoService: CatalogoService,
    private usuarioService: UsuarioService,
    public sesionService: SesionService,
    private simService : SimService
    ) { }

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
  }

  get frmRegistro() {
    return this.formRegistro.controls;
  }


  abrirModal() {
    this.onInitForm();
    setTimeout(() => { }, 300);
    this.modalService.open(this.contentModal, { centered: true, backdrop: 'static', keyboard: false }).result.then((result) => {
      if (result === 'mdl-guardar'){
        this.onGuardar();
      }
      else
        this.cerrarModal.next(undefined);
    }).catch((res) => { });

  }

  onGuardar() {

    this.cerrarModal.next({ estatus: 200, mensaje: "", modelo: { dataExcel: this.dataExcel, archivoActual: this.archivoActual } });

  }


  onSeleccionarArchivo(evt) {

    console.log(evt);
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Ya Existe un archivo seleccionado');
    this.archivoActual = evt.target.files[0];
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      var jsonData = wb.SheetNames.reduce((initial, name) => {
        const sheet = wb.Sheets[name];
        initial[0] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      this.dataExcel = jsonData[0];
      //console.log(jsonData);
      //console.log(this.dataExcel);
    };
    reader.readAsBinaryString(target.files[0]);

  }

  //#region  WEB SERVIES

  registrarMasivoSim(){
    let formData:FormData = new FormData();
    formData.append('uploadFile', this.archivoActual, this.archivoActual.name);
    this.simService.registrarMasivoSim(formData).subscribe((data:any)=>{
      console.log(data)
    },err=>{console.log("err:::",err)})
  }
  //#endregion

}
