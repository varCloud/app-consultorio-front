import { NotasMedicasService } from './../../../../servicios/notas-medicas/notas-medicas.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ColumnMode, id } from '@swimlane/ngx-datatable';
import { EnumTipoToast, ToastService } from 'src/app/utils/toast.service';
import { SesionService } from 'src/app/utils/sesion.service';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MdlUltimaNotaComponent } from '../../componentes-compartidos/mdl-ultima-nota/mdl-ultima-nota.component';

@Component({
  selector: 'app-nota-medica',
  templateUrl: './nota-medica.component.html',
  styleUrls: ['./nota-medica.component.scss']
})
export class NotaMedicaComponent implements OnInit {
  /****************TABLAS ***********/
  limitRows = 20;
  lstNotas = []
  loaderTable = true;
  filteredData: any = [];
  ColumnMode = ColumnMode;
  /****************TABLAS ***********/

  /**************** DATE RANGE PICKER ***********/
  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  /**************** DATE RANGE PICKER ***********/
  constructor(
    private router: Router,
    private notasMedicasService: NotasMedicasService,
    private toastService: ToastService,
    private sesionService: SesionService,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.fromDate = this.calendar.getToday();
    this.toDate = this.calendar.getNext(this.calendar.getToday(), 'd', 0);
    setTimeout(() => {
      this.buscar();
    }, 300);
  }

  /**************** DATE RANGE PICKER ***********/
  onDateSelection(date: NgbDate ,  ngbDatepicker) {

    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;

    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
      ngbDatepicker.close();
    } else if (this.fromDate && !this.toDate && date && date.equals(this.fromDate)) {
      this.toDate = date;
      ngbDatepicker.close();
    }
    else {
      this.toDate = null;
      this.fromDate = date;

    }

  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }
  /**************** DATE RANGE PICKER ***********/

  crearFiltro() {
    this.filteredData = this.lstNotas
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
      this.filteredData = this.lstNotas;
    } {
      const filtered = this.lstNotas.filter((data: any) => {
        return data.filtro.toLowerCase().includes(value.toLowerCase());
      });
      this.filteredData = filtered
    }

  }

  onEditar(item){
    this.router.navigate(['notas/agregar-nota'],{queryParams:{idPaciente:item.idPaciente , idNotaMedica: item.idNotaMedica , editar:true }})
  }

  onVer(item){

    const modalRef = this.modalService.open(MdlUltimaNotaComponent, { size: 'xl', centered: true, backdrop: 'static', keyboard: false })
    modalRef.componentInstance.idPaciente = 0;
    modalRef.componentInstance.idNotaMedica = item.idNotaMedica;

  }


  /**************** WEB SERVICES ***********/

  buscar() {
    this.loaderTable = true;
    let postData = {
      fechaFin: this.toDate.year.toString()+(this.toDate.month.toString().length == 1 ? "0" :"")+this.toDate.month.toString()+(this.toDate.day.toString().length == 1 ? "0" :"")+this.toDate.day.toString(),
      fechaInicio: this.fromDate.year.toString()+(this.fromDate.month.toString().length == 1 ? "0" :"")+this.fromDate.month.toString()+(this.fromDate.day.toString().length == 1 ? "0" :"")+this.fromDate.day.toString(),
      idPaciente: 0
      
    }
    this.notasMedicasService.obteneNotasMedicas(postData).subscribe((data: any) => {
      if (data.estatus == 200) {
        if (data.modelo.length > 0) {
          this.lstNotas = data.modelo;
          this.crearFiltro();
        }
      }
      this.loaderTable = false;
    }, err => {
      this.loaderTable = false;
      this.toastService.mostrar(JSON.stringify(err), EnumTipoToast.info)
    })
  }
}
