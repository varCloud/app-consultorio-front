import { ColoresService } from 'src/app/utils/colores.service';
import { Component, OnInit } from '@angular/core';
import { NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ExportarInfoXlsService } from './../../../../utils/exportar-info-xls.service';
import { ReporteriaService } from 'src/app/servicios/reporteria/reporteria.service';
import { SesionService } from 'src/app/utils/sesion.service';
import { EnumTipoToast, ToastService } from 'src/app/utils/toast.service';

@Component({
  selector: 'app-transacciones-porcanal',
  templateUrl: './transacciones-porcanal.component.html',
  styleUrls: ['./transacciones-porcanal.component.scss']
})
export class TransaccionesPorcanalComponent implements OnInit {

    hoveredDate: NgbDate | null = null;
    fromDate: NgbDate | null;
    toDate: NgbDate | null;
    filteredData: any[] = [];
    allData: any[] = [];
    limitRows =20;
    idStatusTransaction = 0;

    constructor(
      private calendar: NgbCalendar,
      public formatter: NgbDateParserFormatter,
      public coloresService:ColoresService,
      private reporteriaService : ReporteriaService,
      public sesionService: SesionService,
      private toastService: ToastService,
      private exportarInfoXlsService: ExportarInfoXlsService
      ) {
      this.fromDate = calendar.getNext(calendar.getToday(), 'd', -1);
      this.toDate = calendar.getToday();
    }

    ngOnInit(): void {
      setTimeout(() => {
        this.getVentasPorCanal();
      }, 100)
    }

    onBuscar() {
     this.getVentasPorCanal();
    }

    getVentasPorCanal(){
      this.limitRows = 20;
      let postData = {
        dateBegin : this.formatter.format(this.fromDate),//.replace(/-/gi,''),
        dateEnd : this.formatter.format(this.toDate),//.replace(/-/gi,''),
        idMvno : this.sesionService.sesion.idMvno,
        idStatusTransaction : this.idStatusTransaction
      }

      this.reporteriaService.getVentasPorCanal(postData).subscribe((data: any) => {
        if (data.status == 200) {
          this.allData = data.model;
          this.filteredData = this.allData;
          this.paginateItems(this.limitRows);
        } else {
          this.toastService.mostrar('No existen registros para el rango de fechas seleccionado', EnumTipoToast.info)
        }
      })
    }

    onDateSelection(date: NgbDate) {
      if (!this.fromDate && !this.toDate) {
        this.fromDate = date;
      } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
        this.toDate = date;
      } else {
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

    onExportar(value: any) {
      let dataExport = value == 1  ? JSON.parse(JSON.stringify(this.filteredData)) : JSON.parse(JSON.stringify(this.allData));
      console.log('exportar', dataExport);
      this.exportarInfoXlsService.exportAsExcelTable(
        dataExport,
        'Transacciones'
      );
    }

    updateFilter(value: any) {
      if (value === '') {
        this.filteredData = this.allData;
      } {
        const filtered = this.allData.filter((data: any) => {
          return data.canalIntegracion.toLowerCase().includes(value.toLowerCase()) ||
          data.idIntegrationChannel == value
        });
        this.filteredData = filtered
      }
    }

    paginateItems(totalItems){
      this.filteredData = this.allData.slice(0,totalItems)
    }

  }
