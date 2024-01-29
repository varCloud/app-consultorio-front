
import { PacienteService } from './../../../../../servicios/paciente/paciente.service';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { NgbModal, NgbDateStruct, NgbInputDatepickerConfig, NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { CatalogoService } from 'src/app/servicios/catalogo/catalogo.service';
import { UsuarioService } from 'src/app/servicios/usuario/usuario.service';
import { SesionService } from 'src/app/utils/sesion.service';
import { ToastService, EnumTipoToast } from 'src/app/utils/toast.service';
import { WizardComponent as BaseWizardComponent } from 'angular-archwizard';



@Component({
  selector: 'app-mdl-registra-paciente',
  templateUrl: './mdl-registra-paciente.component.html',
  styleUrls: ['./mdl-registra-paciente.component.scss']
})
export class MdlRegistraPacienteComponent implements OnInit {

  @ViewChild('wizardForm') wizardForm: BaseWizardComponent;
  @Input() public modelo;
  @Output() cerrarModal = new EventEmitter<any>();

  formRegistro: FormGroup;
  tiposUsuarios = [];
  lstMvnos = [];
  esAdministrador = false;
  esShowPass = false;
  tituloModal = "Historia Clinica";
  selectedDate: NgbDateStruct;
  showAge
  lstPregAntecedenFamiliares = []
  lstPregAntecedenPersonales = []
  lstPregAntecedenPatologicos = []
  lstPregAntecedenGineco = []
  idPaciente = 0;
  /********************ejemplo wizar */
  validationFrmInformacionBasica: FormGroup;
  formAnteFamiliares: FormGroup;
  formAntePersonales: FormGroup;
  formAntePatologicos: FormGroup;
  formAnteGineco: FormGroup;
  validationForm2: FormGroup;

  isForm1Submitted: Boolean;
  isForm2Submitted: Boolean;
  isFormAntecedenFamSubmitted: Boolean;
  isFormAntePersonalesSubmitted: Boolean;
  isFormAntePatologicosSubmitted: Boolean;
  isFormAnteGinecoSubmitted: Boolean;
  /********************ejemplo wizar */

  constructor(
    private modalService: NgbModal,
    public formBuilder: FormBuilder,
    private toast: ToastService,
    private catalogoService: CatalogoService,
    public sesionService: SesionService,
    config: NgbInputDatepickerConfig,
    calendar: NgbCalendar,
    private pacienteService: PacienteService,
    private toastService: ToastService
  ) {
    config.minDate = { year: 1900, month: 1, day: 1 };
    config.maxDate = { year: 2099, month: 12, day: 31 };
    // // days that don't belong to current month are not visible
    config.outsideDays = 'hidden';
    // // weekends are disabled
    config.markDisabled = (date: NgbDate) => calendar.getWeekday(date) >= 6;
    // // setting datepicker popup to close only on click outside
    config.autoClose = 'outside';
    // // setting datepicker popup to open above the input
    config.placement = ['top-left', 'top-right'];

  }

  ngOnInit(): void {
    console.log("modelo:", this.modelo)
    this.tituloModal = this.modelo.tituloModal
    this.idPaciente = this.modelo.paciente.idPaciente
    this.onInitForm();


    this.validationForm2 = this.formBuilder.group({
      email: [''],
      mobileNumber: [''],
      password: [''],
    });

    /**
     * form Antecedentes Familiares
     */
    this.formAnteFamiliares = this.formBuilder.group({
      preguntas: new FormArray([])
    });

    /**
    * form Antecedentes Personales
    */
    this.formAntePersonales = this.formBuilder.group({
      preguntas: new FormArray([])
    });

    /**
    * form Antecedentes Patologicos
    */
    this.formAntePatologicos = this.formBuilder.group({
      preguntas: new FormArray([])
    });

    /**
    * form Antecedes Gineco-Obstétricos
    */
    this.formAnteGineco = this.formBuilder.group({
      preguntas: new FormArray([])
    });

    this.isForm1Submitted = false;
    this.isForm2Submitted = false;
    this.isFormAntecedenFamSubmitted = false;
    this.isFormAntePersonalesSubmitted = false;
    this.isFormAntePatologicosSubmitted = false;
    this.isFormAnteGinecoSubmitted = false;
  }
  /**
   * Wizard finish function
   */
  finishFunction() {
    this.modelo.modal.close({ cerrar: "cerrar" })
  }

  get form2() {
    return this.validationForm2.controls;
  }

  /**
   * Returns form
   */
  get frmFamiliares() {
    return this.formAnteFamiliares.controls;
  }

  get frmFamiliaresPreg() {
    return this.frmFamiliares.preguntas as FormArray;
  }

  getFrmPreguntaFam(index) :  FormGroup{
    return (this.frmFamiliaresPreg.at(index) as FormGroup)
  }

  /**
   * Go to next step while form value is valid
   */
  submitDatiosGenerales() {
    //console.log("form1Submit", this.formRegistro.value, "this.frmRegistro.valid ", this.formRegistro.valid)
    if (this.formRegistro.valid) {
      this.guardarPaciente();
    }
    this.isForm1Submitted = true;

  }

  /**
   * Go to next step while form value is valid
   */
  submitAntecedentesFamiliares() {
    //console.log("data submitAntecedentesFamiliares", this.formAnteFamiliares.controls.preguntas.value, "valido", this.formAnteFamiliares.valid)
    if (this.formAnteFamiliares.valid) {
      this.guardarRespuestaHistoriaClinica(this.formAnteFamiliares)
    }
    this.isFormAntecedenFamSubmitted = true;
  }

  submitAntecedentesPersonales() {
    //console.log("data submitAntecedentesPersonales", this.formAntePersonales.controls.preguntas.value, "valido", this.formAntePersonales.valid)
    if (this.formAntePersonales.valid) {
      this.guardarRespuestaHistoriaClinica(this.formAntePersonales)
    }
    this.isFormAntePersonalesSubmitted = true;

  }

  submitAntecedentesPatologicos() {
    //console.log("data submitAntecedentesPatologicos", this.formAntePatologicos.controls.preguntas.value, "valido", this.formAntePatologicos.valid)
    if (this.formAntePatologicos.valid) {
      this.guardarRespuestaHistoriaClinica(this.formAntePatologicos)
    }
    this.isFormAntePatologicosSubmitted = true;
  }

  submitAntecedentesGineco() {
    //console.log("data submitAntecedentesGineco", this.formAnteGineco.controls.preguntas.value, "valido", this.formAnteGineco.valid)
    if (this.formAnteGineco.valid) {
      this.guardarRespuestaHistoriaClinica(this.formAnteGineco)
    }
    this.isFormAnteGinecoSubmitted = true;
  }

  onDateSelected(ngbDatepicker) {
    if (this.selectedDate) {
      let dateString = this.selectedDate.year + "-" + (this.selectedDate.month.toString().length == 1 ? "0" + this.selectedDate.month.toString() : this.selectedDate.month.toString()) + "-" + this.selectedDate.day
      console.log(dateString)
      const convertAge = new Date(dateString);
      const timeDiff = Math.abs(Date.now() - convertAge.getTime());
      this.showAge = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
      this.formRegistro.controls.edad.setValue(this.showAge)
      this.formRegistro.controls.fechaNacimiento.setValue(dateString)
      ngbDatepicker.close()
    }
    console.log(this.selectedDate)
  }

  onInitForm() {
    this.formRegistro = this.formBuilder.group({
      idPaciente: [this.idPaciente],
      nombres: ['', Validators.required],
      telefono: ['', Validators.required],
      apellidoPaterno: ['', Validators.required],
      apellidoMaterno: [''],
      correo: ['', [Validators.required, Validators.email]],
      edad: [''],
      fechaNacimiento: [''],
      _fechaNacimiento: ['', Validators.required],
      estadoCivil: ['', Validators.required],
      residencia:['', Validators.required],
      escolaridad:['', Validators.required],
      ocupacion:['', Validators.required],
    });


    if (this.modelo.editar) {
      this.selectedDate = {
        day: parseInt(this.modelo.paciente._fechaNacimiento.split('-')[2]),
        month: parseInt(this.modelo.paciente._fechaNacimiento.split('-')[1]),
        year: parseInt(this.modelo.paciente._fechaNacimiento.split('-')[0])
      };

      this.formRegistro.patchValue({

        idPaciente: this.modelo.paciente.idPaciente,
        nombres: this.modelo.paciente.nombres,
        telefono: this.modelo.paciente.telefono,
        apellidoPaterno: this.modelo.paciente.apellidoPaterno,
        apellidoMaterno: this.modelo.paciente.apellidoMaterno,
        correo: this.modelo.paciente.correo,
        edad: this.modelo.paciente.edad,
        fechaNacimiento: this.modelo.paciente.fechaNacimiento,
        _fechaNacimiento: this.selectedDate,
        estadoCivil:  this.modelo.paciente.estadoCivil,
        residencia: this.modelo.paciente.residencia,
        escolaridad: this.modelo.paciente.escolaridad,
        ocupacion: this.modelo.paciente.ocupacion,

      })
    }

    //this.onDateSelected();
    this.obtenerPreguntasRespuestasXPaciente();
  }

  get frmRegistro() {
    return this.formRegistro.controls;
  }

  onShowPass() {
    if (this.frmRegistro.contrasena.enabled)
      this.esShowPass = !this.esShowPass
  }

  clearFilter($e, pregunta: any) {

    console.log("event", $e.target.value, "controles pregunta", pregunta.controls)
    if ($e.target.value == 'si') {
      pregunta.controls.descripcion.setValidators(Validators.required)
    } else {
      pregunta.controls.descripcion.clearValidators();
      pregunta.controls.descripcion.updateValueAndValidity();
    }


  }

  construirPreguntas(data) {

    this.lstPregAntecedenFamiliares = data.modelo.filter(x => x.idTipoHistoriaClinica == 1)
    //console.log(this.lstPregAntecedenFamiliares);
    this.lstPregAntecedenFamiliares.forEach(element => {
      this.frmFamiliaresPreg.push(this.formBuilder.group({
        preguntaDesc: [element.descripcion],
        idPregunta: [element.idPregunta],
        descripcion: [element.descripcionRespuesta],
        siNo: [element.respuestaRapida, Validators.required],
        idRespuesta: [0]
      }));
    });

    this.lstPregAntecedenPersonales = data.modelo.filter(x => x.idTipoHistoriaClinica == 2)
    //console.log(this.lstPregAntecedenPersonales);
    this.lstPregAntecedenPersonales.forEach(element => {
      (this.formAntePersonales.controls.preguntas as FormArray).push(this.formBuilder.group({
        preguntaDesc: [element.descripcion],
        idPregunta: [element.idPregunta],
        descripcion: [element.descripcionRespuesta],
        siNo: [element.respuestaRapida, Validators.required],
        idRespuesta: [0]

      }));
    });


    this.lstPregAntecedenPatologicos = data.modelo.filter(x => x.idTipoHistoriaClinica == 3)
    //console.log(this.lstPregAntecedenPatologicos);
    this.lstPregAntecedenPatologicos.forEach(element => {
      (this.formAntePatologicos.controls.preguntas as FormArray).push(this.formBuilder.group({
        preguntaDesc: [element.descripcion],
        idPregunta: [element.idPregunta],
        descripcion: [element.descripcionRespuesta],
        siNo: [element.respuestaRapida, Validators.required],
        idRespuesta: [0]

      }));
    });


    this.lstPregAntecedenGineco = data.modelo.filter(x => x.idTipoHistoriaClinica == 4)
    //console.log(this.lstPregAntecedenGineco);
    this.lstPregAntecedenGineco.forEach(element => {
      (this.formAnteGineco.controls.preguntas as FormArray).push(this.formBuilder.group({
        preguntaDesc: [element.descripcion],
        idPregunta: [element.idPregunta],
        descripcion: [element.descripcionRespuesta],
        siNo: [element.respuestaRapida, Validators.required],
        idRespuesta: [0]

      }));
    });


  }
  /********************************************************************** *
  /////////////////////////////////WEB SERVIES/////////////////////////////////
  /********************************************************************** */


  obtenerPreguntasRespuestasXPaciente() {
    this.pacienteService.obtenerPreguntasRespuestasXPaciente({ idPaciente: this.idPaciente }).subscribe((data: any) => {
      //console.log(data)
      if (data.estatus == 200) {
        this.construirPreguntas(data)
      } else {
        this.toast.mostrar(data.mensaje, EnumTipoToast.info)
      }
    }, err => {
      this.toast.mostrar(err, EnumTipoToast.error)
    })
  }

  guardarPaciente() {
    this.pacienteService.registrarPaciente(this.formRegistro.value).subscribe((data: any) => {
      if (data.estatus == 200) {
        this.toastService.mostrar(data.mensaje, EnumTipoToast.success)
        this.idPaciente = data.modelo.idPaciente
        this.formRegistro.controls.idPaciente.setValue(this.idPaciente)
        this.wizardForm.goToNextStep();
      } else {
        this.toastService.mostrar(data.mensaje, EnumTipoToast.info)
      }
    }, err => {
      this.toastService.mostrar(JSON.stringify(err), EnumTipoToast.info)
    })
  }

  guardarRespuestaHistoriaClinica(form) {

    this.pacienteService.guardarRespuestaHistoriaClinica({ ...form.value, idPaciente: this.idPaciente }).subscribe((data: any) => {
      if (data.estatus == 200) {
        this.toastService.mostrar(data.mensaje, EnumTipoToast.success)
        this.wizardForm.goToNextStep();
      } else {
        this.toastService.mostrar(data.mensaje, EnumTipoToast.info)
      }
    }, err => {
      this.toastService.mostrar(JSON.stringify(err), EnumTipoToast.info)
    })
  }

}
