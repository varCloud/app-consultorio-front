import { PacienteService } from './../../../../servicios/paciente/paciente.service';
import { NotaMedicaUtilsService } from './../../../../utils/nota-medica-utils.service';
import { Router } from '@angular/router';
import { EnumTipoToast, ToastService } from './../../../../utils/toast.service';
import { NotasMedicasService } from './../../../../servicios/notas-medicas/notas-medicas.service';
import { UsuarioService } from 'src/app/servicios/usuario/usuario.service';
import { Component, OnInit } from '@angular/core';
import { EnumTipoUsuario } from 'src/app/entidades/enumeraciones';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MdlUltimaNotaComponent } from '../../componentes-compartidos/mdl-ultima-nota/mdl-ultima-nota.component';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.scss']
})
export class HistorialComponent implements OnInit {

  /****************TABLAS ***********/
  limitRows = 20;
  loaderTable = false;
  filteredData = [];
  lstNotasMedicas = []
  ColumnMode = ColumnMode;

  pacienteSeleccionado
  lstPacientes
  idPaciente
  paciente

  constructor(
    private usuarioService: UsuarioService,
    private notasMedicasService: NotasMedicasService,
    private toastService: ToastService,
    private router: Router,
    private modalService: NgbModal,
    private notaMedicaUtilsService: NotaMedicaUtilsService,
    private pacienteService: PacienteService
  ) { }

  ngOnInit(): void {
    this.obtenerUsuarios()
  }

  obtenerUsuarios() {
    let postData = { idTipoUsuario: EnumTipoUsuario.Admin_MVNO }
    this.usuarioService.obtenerPacientes(postData).subscribe((data: any) => {
      if (data.estatus == 200) {
        this.lstPacientes = data.modelo;
      }
    }, err => {

    })
  }

  onSeleccionPaciente(item) {
    this.paciente = this.lstPacientes.find(x => x.idPaciente == item)
    if (this.paciente) {
      this.loaderTable = true;
      this.lstNotasMedicas = [];
      this.obtenerNotasMedicasPorUsuario();
      this.obtenerPreguntasRespuestasXPaciente();
    }

  }

  crearFiltro() {
    this.filteredData = this.lstNotasMedicas
    this.filteredData.map((item: any) => {
      item.filtro =
        item.nombreCompleto +
        '' +
        item.idUsuario +
        '' +
        item.correo
    });
  }

  updateFilter(value: any) {
    if (value === '') {
      this.filteredData = this.lstNotasMedicas;
    } else {
      const filtered = this.lstNotasMedicas.filter((data: any) => {
        return data.filtro.toLowerCase().includes(value.toLowerCase());
      });
      this.filteredData = filtered
    }
    console.log("value", value, this.filteredData, this.lstNotasMedicas)
  }

  onAgregarNota() {
    if (this.idPaciente)
      this.router.navigate(['notas/agregar-nota'], { queryParams: { idPaciente: this.idPaciente, idNotaMedica: undefined, editar: true } })
  }

  descargarExpediente() {
    if (this.lstNotasMedicas.length > 0) {
      let docDf2: any = { content: [] }
      docDf2.content.push(this.notaMedicaUtilsService.creadPdfHistoriaClinica(this.paciente , true))
      this.lstNotasMedicas.forEach((element, index) => {
        console.log(index, this.lstNotasMedicas.length)
        docDf2.content.push(this.notaMedicaUtilsService.creadPdfNotaMedica(element, (index == this.lstNotasMedicas.length - 1 ? false : true)))
      });
      pdfMake.createPdf(docDf2).open();
    }

  }

  onVer(data) {
    const modalRef = this.modalService.open(MdlUltimaNotaComponent, { size: 'xl', centered: true, backdrop: 'static', keyboard: false })
    modalRef.componentInstance.idPaciente = 0;
    modalRef.componentInstance.idNotaMedica = data.idNotaMedica;
  }

  construirPreguntas(data) {
    this.paciente.lstPregAntecedenFamiliares = data.modelo.filter(x => x.idTipoHistoriaClinica == 1)
    this.paciente.lstPregAntecedenPersonales = data.modelo.filter(x => x.idTipoHistoriaClinica == 2)
    this.paciente.lstPregAntecedenPatologicos = data.modelo.filter(x => x.idTipoHistoriaClinica == 3)
    this.paciente.lstPregAntecedenGineco = data.modelo.filter(x => x.idTipoHistoriaClinica == 4)
  }


  /************WEB SERVICES************ */

  obtenerNotasMedicasPorUsuario() {
    if (this.idPaciente) {
      this.notasMedicasService.obtenerNotaMedicaXPaciente({ idPaciente: this.idPaciente }).subscribe((data: any) => {
        if (data.estatus == 200 && data.modelo.length > 0) {
          this.lstNotasMedicas = data.modelo
          this.crearFiltro();
        } else {
          this.toastService.mostrar("No existen notas medicas para este paciente", EnumTipoToast.info)
        }
        this.loaderTable = false
      }, err => {
        this.loaderTable = false
      })
    }
  }

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