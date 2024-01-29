import { PacienteService } from './../../../../../servicios/paciente/paciente.service';
import { Router, RouterEvent, ActivatedRoute } from '@angular/router';
import { NotasMedicasService } from '../../../../../servicios/notas-medicas/notas-medicas.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import Swal from 'sweetalert2';
import { NotaMedicaUtilsService } from 'src/app/utils/nota-medica-utils.service';


@Component({
  selector: 'app-agregar-nota-medica',
  templateUrl: './agregar-nota-medica.component.html',
  styleUrls: ['./agregar-nota-medica.component.scss']
})
export class AgregarNotaMedicaComponent implements OnInit {
  formRegistro: FormGroup;
  isForm1Submitted = false;
  paciente?
  idPaciente: any
  quillConfig: any
  notaMedica: any
  idNotaMedica: any
  editar;
  docDf2: any
  constructor(
    public formBuilder: FormBuilder,
    private notasMedicasService: NotasMedicasService,
    private route: ActivatedRoute,
    private router: Router,
    private pacienteService: PacienteService,
    private notaMedicaUtilsService: NotaMedicaUtilsService

  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(
      params => {
        this.idPaciente = params['idPaciente'];
        this.idNotaMedica = params['idNotaMedica'];
        this.editar = params['editar'];
      }
    )
    this.onInitForm();
    this.onInitEditor();
    setTimeout(() => {
      this.obtenerPaciente();
    }, 100);
  }


  onInitForm() {
    this.formRegistro = this.formBuilder.group({
      idPaciente: [this.idPaciente],
      idNotaMedica: [this.idNotaMedica || 0],
      peso: ['', Validators.required],
      talla: ['', Validators.required],
      temperatura: ['', Validators.required],
      saturacion: ['', Validators.required],
      ta: ['', Validators.required],
      fc: ['', Validators.required],
      fr: ['', [Validators.required]],
      motivoConsulta: ['', [Validators.required]],
      diagnostico: ['', [Validators.required]],
      tratamiento: ['', [Validators.required]],
      laboratorios: ['', [Validators.required]],
    });

    if (this.idNotaMedica) {
      this.obtenerNotaMedica();
    }

  }

  onInitEditor() {
    this.quillConfig = {
      toolbar: {
        container: [
          ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
          ['code-block'],
          //  [{ 'header': 1 }, { 'header': 2 }],               // custom button values
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
          [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
          //  [{ 'direction': 'rtl' }],                         // text direction

          //  [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

          [{ 'align': [] }],

          //  ['clean'],                                         // remove formatting button

          //  ['link'],
          ['link', 'image', 'video']
        ],
      },
    }
  }

  get frmRegistro() {
    return this.formRegistro.controls
  }

  onSelectionChanged = (event) => {
    if (event.oldRange == null) {
      this.onFocus();
    }
    if (event.range == null) {
      this.onBlur();
    }
  }

  onContentChanged = (event) => {
    // console.log(event.html);
  }
  onFocus = () => {
    //console.log("On Focus");
  }
  onBlur = () => {
    //console.log("Blurred");
  }

  cargarInfoNotaMedica() {
    this.formRegistro.patchValue({
      idPaciente: this.notaMedica.idPaciente,
      idNotaMedica: this.notaMedica.idNotaMedica,
      peso: this.notaMedica.peso,
      talla: this.notaMedica.talla,
      temperatura: this.notaMedica.temperatura,
      saturacion: this.notaMedica.saturacion,
      ta: this.notaMedica.ta,
      fc: this.notaMedica.fc,
      fr: this.notaMedica.fr,
      motivoConsulta: this.notaMedica.motivoConsulta,
      diagnostico: this.notaMedica.diagnostico,
      tratamiento: this.notaMedica.tratamiento,
      laboratorios:this.notaMedica.laboratorios,
      
    });
    if (this.editar == 'false') {
      this.formRegistro.disable();

    }
  }

  imprimir(notaMedica) {
   
      this.docDf2 = { content: [] }
      this.docDf2.content.push(this.notaMedicaUtilsService.creadPdfNotaMedica(notaMedica))
      pdfMake.createPdf(this.docDf2).open();
    
  }
  /******************WEB SERVICES************************** */
  obtenerPaciente() {
    this.pacienteService.obtenerPacienteXId({ idPaciente: this.idPaciente }).subscribe((data: any) => {
      if (data.estatus == 200) {
        this.paciente = data.modelo
      }
    })
  }

  obtenerNotaMedica() {
    this.notasMedicasService.obteneNotasMedicasXId({ idNotaMedica: this.idNotaMedica }).subscribe((data: any) => {
      if (data.estatus == 200) {
        this.notaMedica = data.modelo;
        this.cargarInfoNotaMedica()
      }
    })
  }

  guardar() {
    this.isForm1Submitted = true;
    console.log(this.formRegistro.value);
    this.notasMedicasService.guardarNotaMedica(this.formRegistro.value).subscribe((data: any) => {
      if (data.estatus == 200) {
        Swal.fire({
          title: data.mensaje,
          showCancelButton: true,
          confirmButtonText: 'Imprimir nota medica',
          cancelButtonText: "Aceptar",
          icon: 'success',
        }).then((result) => {
          if (result.isConfirmed) {
            this.imprimir({...data.modelo,...this.paciente })
          }
        })
      }
    })
  }
}
