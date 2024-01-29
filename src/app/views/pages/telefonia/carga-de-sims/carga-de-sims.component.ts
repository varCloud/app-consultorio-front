import { Router } from '@angular/router';
import { ToastService, EnumTipoToast } from './../../../../utils/toast.service';
import { SimService } from './../../../../servicios/sim/sim.service';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-carga-de-sims',
  templateUrl: './carga-de-sims.component.html',
  styleUrls: ['./carga-de-sims.component.scss']
})
export class CargaDeSimsComponent implements OnInit {

  model: any = { abrir: false };
  dataExcel: any = []
  loaderTable
  ColumnMode: ColumnMode
  filteredData = []
  archivoActual: File
  lstProductos = [];
  idProducto = '';


  constructor(
    private simService: SimService,
    private toastService: ToastService,
    private router: Router

  ) { }

  ngOnInit(): void {

    setTimeout(() => { this.obtenerProductosSim() }, 300)
  }

  //#region  Eventos

  onAbrirModalRegistro() {
    this.model = { abrir: true, editar: false };
  }

  onCerrarModalRegistro(event) {
    this.model.abrir = false;
    console.log("onCerrarModalRegistro", event)
    if (event) {
      if (event.estatus == 200) {
        this.dataExcel = event.modelo.dataExcel
        this.archivoActual = event.modelo.archivoActual
        this.crearFiltro();
      }
    }
  }

  updateFilter(value: any) {
    if (value === '') {
      this.filteredData = this.dataExcel;
    } {
      const filtered = this.dataExcel.filter((data: any) => {
        return data.filtro.toLowerCase().includes(value.toLowerCase());
      });
      this.filteredData = filtered
    }

  }

  crearFiltro() {
    this.filteredData = this.dataExcel
    this.filteredData.map((item: any) => {
      item.filtro =
        item.msisdn +
        '' +
        item.icc_id
    });
  }

  onGuardarSims() {
    if (this.idProducto !== '') {
      this.registrarMasivoSim();
    } else {
      this.toastService.mostrar("Por favor seleccione un tipo de producto", EnumTipoToast.info)
    }
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
      this.crearFiltro();
      //console.log(jsonData);
      //console.log(this.dataExcel);
    };
    reader.readAsBinaryString(target.files[0]);

  }

  alertCargaExitosa() {
    let title = "Sims Cargadas Con Exito"
    Swal.fire({
      title: title,
      showCancelButton: true,
      confirmButtonText: 'Ir a Administración de sims',
      icon: 'question',
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['telefonia/admin-sims'], { replaceUrl: true })
      }
    })
  }
  //#endregion

  //#region  WS
  registrarMasivoSim() {
    let formData: FormData = new FormData();
    formData.append('idProduct', this.idProducto);
    formData.append('idEstatusSim', '1');
    formData.append('idEstatusAsignacionSim', '1');
    formData.append('file', this.archivoActual, this.archivoActual.name);
    this.simService.registrarMasivoSim(formData).subscribe((data: any) => {
      if (data.estatus == 200) {

        this.toastService.mostrar(data.mensaje, EnumTipoToast.success)
        this.alertCargaExitosa();
      } else {
        this.toastService.mostrar(data.mensaje, EnumTipoToast.info)
      }
    }, err => {
      this.toastService.mostrar(err.message, EnumTipoToast.error)
    })
  }

  obtenerProductosSim() {
    this.simService.consultarProductosSim({}).subscribe((data: any) => {
      if (data.estatus == 200) {
        this.lstProductos = data.modelo
      }
    })
  }
  //#endregion
}
