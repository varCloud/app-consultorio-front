import { Component, Input, OnInit } from '@angular/core';
import { PacienteService } from 'src/app/servicios/paciente/paciente.service';
import { ToastService, EnumTipoToast } from 'src/app/utils/toast.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { NotaMedicaUtilsService } from 'src/app/utils/nota-medica-utils.service';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-mdl-historia-clinica',
  templateUrl: './mdl-historia-clinica.component.html',
  styleUrls: ['./mdl-historia-clinica.component.scss']
})
export class MdlHistoriaClinicaComponent implements OnInit {
  @Input() public modelo;
  idPaciente
  paciente:any


  lstPregAntecedenFamiliares = []
  lstPregAntecedenPersonales = []
  lstPregAntecedenPatologicos = []
  lstPregAntecedenGineco = []
  constructor(
    private pacienteService: PacienteService,
    private toastService: ToastService,
    private notaMedicaUtilsService: NotaMedicaUtilsService,

  ) { }

  ngOnInit(): void {

    this.idPaciente = this.modelo.paciente.idPaciente
    this.paciente = this.modelo.paciente;
    this.obtenerPreguntasRespuestasXPaciente();
  }



  construirPreguntas(data) {

    this.lstPregAntecedenFamiliares = data.modelo.filter(x => x.idTipoHistoriaClinica == 1)
    console.log(this.lstPregAntecedenFamiliares);

    this.lstPregAntecedenPersonales = data.modelo.filter(x => x.idTipoHistoriaClinica == 2)
    console.log(this.lstPregAntecedenPersonales);

    this.lstPregAntecedenPatologicos = data.modelo.filter(x => x.idTipoHistoriaClinica == 3)
    console.log(this.lstPregAntecedenPatologicos);

    this.lstPregAntecedenGineco = data.modelo.filter(x => x.idTipoHistoriaClinica == 4)
    console.log(this.lstPregAntecedenGineco);

    this.paciente.lstPregAntecedenFamiliares = this.lstPregAntecedenFamiliares
    this.paciente.lstPregAntecedenPersonales = this.lstPregAntecedenPersonales
    this.paciente.lstPregAntecedenPatologicos = this.lstPregAntecedenPatologicos
    this.paciente.lstPregAntecedenGineco = this.lstPregAntecedenGineco

  }

  onImprimirHistoriaClinica(){
    let docDf2: any = { content: [] }
    docDf2.content.push(this.notaMedicaUtilsService.creadPdfHistoriaClinica(this.paciente))
    pdfMake.createPdf(docDf2).open();
  }

  /********************************************************************** *
  /////////////////////////////////WEB SERVIES/////////////////////////////////
  /********************************************************************** */


  obtenerPreguntasRespuestasXPaciente() {
    this.pacienteService.obtenerPreguntasRespuestasXPaciente({ idPaciente: this.idPaciente }).subscribe((data: any) => {
      console.log(data)
      if (data.estatus == 200) {
        this.construirPreguntas(data)
      } else {
        this.toastService.mostrar(data.mensaje, EnumTipoToast.info)
      }
    }, err => {
      this.toastService.mostrar(err, EnumTipoToast.error)
    })
  }
}
