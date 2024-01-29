import { ExportarInfoXlsService } from './../../../../utils/exportar-info-xls.service';
import { ColoresService } from 'src/app/utils/colores.service';
import { SesionService } from 'src/app/utils/sesion.service';
import { CatalogoService } from 'src/app/servicios/catalogo/catalogo.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SimService } from 'src/app/servicios/sim/sim.service';
import { EnumTipoToast, ToastService } from 'src/app/utils/toast.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-administracion-de-sims',
  templateUrl: './administracion-de-sims.component.html',
  styleUrls: ['./administracion-de-sims.component.scss']
})
export class AdministracionDeSimsComponent implements OnInit {

  @ViewChild('filtro') filtro: ElementRef;
  model: any = { abrir: false };

  //variables para el componente de edicion
  abrirModalEditar: boolean = false;


  lstMvnos = [];
  lstAsignacion = [];
  lstEstatusSim = [];
  lstSims = [];
  filteredData = [];
  formFiltro: FormGroup;
  idMvno = '';
  loaderTable = false;
  limitRows = 20

  constructor(
    private simService: SimService,
    public formBuilder: FormBuilder,
    private catalogoService: CatalogoService,
    private toast: ToastService,
    public sesionService: SesionService,
    private toastService: ToastService,
    public coloresService: ColoresService,
    private exportarInfoXlsService: ExportarInfoXlsService
  ) { }

  ngOnInit(): void {
    this.initForm();
    setTimeout(() => {
      this.obtenerEstatusSim();
      this.obtenerMvno();
      this.obtenerEstatusSimAsignacion();
    }, 300)
  }

  initForm() {
    this.formFiltro = this.formBuilder.group({
      idMVNO: [this.sesionService.sesion.idMvno],
      idEstatusSim: [''],
      idEstatusAsignacionSim: ['',],
      idTipoUsuario: [this.sesionService.sesion.idTipoUsuario],

    });
  }


  //#region  Eventos

  onCerrarModalRegistro(event) {
    if (event) {
      if (event.estatus == 200) {
        this.obtenerSims();
      }
    }
  }

  onAbrirModalRegistro() {
    this.model = {
      abrir: true,
      editar: false,
      lstAsignacion: this.lstAsignacion,
      lstEstatusSim: this.lstEstatusSim
    };
  }

  onBuscar() {
    this.obtenerSims();
  }

  get frmFiltro() {
    return this.formFiltro.controls
  }

  updateFilter(value: any) {
    if (value === '') {
      this.filteredData = this.lstSims;
    } {
      const filtered = this.lstSims.filter((data: any) => {
        return data.filtro.toLowerCase().includes(value.toLowerCase());
      });
      this.filteredData = filtered
    }

  }

  crearFiltro() {
    this.filteredData = this.lstSims
    this.filteredData.map((item: any) => {
      item.filtro =
        item.msisdn +
        '' +
        item.icc
    });
  }

  onEditar(item) {
    this.model = {
      abrir: true,
      editar: true,
      ...item,
      lstAsignacion: this.lstAsignacion,
      lstEstatusSim: this.lstEstatusSim
    }
  }

  onVer(item) {
    this.model = {
      abrir: true,
      editar: false,
      ver: true,
      ...item,
      lstAsignacion: this.lstAsignacion,
      lstEstatusSim: this.lstEstatusSim
    }
  }

  onDesactivar(item) {
    let title = "Estas seguro que desea eliminar el registro"
    Swal.fire({
      title: title,
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      icon: 'question',
    }).then((result) => {
      if (result.isConfirmed) {
        this.desactivarSim(item)
      }
    })
  }

  onExportar(value: any) {
    let dataExport = value == 1  ? JSON.parse(JSON.stringify(this.filteredData)) : JSON.parse(JSON.stringify(this.lstSims));
    console.log('exportar', dataExport);
    this.exportarInfoXlsService.exportAsExcelTable(
      dataExport,
      'Sims'
    );
  }



  //#endregion

  //#region  WS
  obtenerSims() {
    this.simService.consultarSims(this.formFiltro.value).subscribe((data: any) => {
      if (data.estatus == 200) {
        this.lstSims = [];
        this.lstSims = data.modelo;
        this.crearFiltro();
      } else {
        this.toastService.mostrar(data.mensaje, EnumTipoToast.info)
      }
      this.filtro.nativeElement.value = '';
      this.loaderTable = false;
    })
  }

  obtenerEstatusSim() {
    this.simService.consultarEstatusSim({}).subscribe((data: any) => {
      if (data.estatus == 200) {
        this.lstEstatusSim = data.modelo
        this.lstEstatusSim.unshift({
          "idEstatusSim": "0",
          "estatusSim": "Todos"
        })
        this.frmFiltro.idEstatusSim.setValue("0")
      }
    })
  }

  obtenerEstatusSimAsignacion() {
    this.simService.consultarEstatusAsignacion({}).subscribe((data: any) => {
      if (data.estatus == 200) {
        this.lstAsignacion = data.modelo
        this.lstAsignacion.unshift({
          "idEstatusAsignacionSim": "0",
          "estatusAsignacion": "Todos"
        })
        this.frmFiltro.idEstatusAsignacionSim.setValue("0")
      }
    })
  }

  obtenerMvno() {
    this.catalogoService.obtenerMvno().subscribe((data: any) => {
      if (data.estatus == 200) {
        this.lstMvnos = data.modelo;
        if (this.lstMvnos.length == 1) {
          this.idMvno = this.sesionService.sesion.idMvno
          //this.frmRegistro.idMvno.disable();
        }
      } else {
        this.toast.mostrar(data.mensaje, EnumTipoToast.info)
      }
    }, err => {
      this.toast.mostrar(err, EnumTipoToast.error)
    })
  }


  desactivarSim(row) {
    let postData = {
      idSim: row.idSim,
      imsi: row.imsi,
      iccId: row.icc,
      msisdn: row.msisdn,
      activo: 0
    }
    this.simService.eliminarActivarSim(postData).subscribe((data: any) => {
      if (data.estatus == 200) {
        this.toastService.mostrar(data.mensaje, EnumTipoToast.success)
      } else {
        this.toastService.mostrar(data.mensaje, EnumTipoToast.info)
      }
      this.obtenerSims();
    }, err => {
      this.toastService.mostrar(err.message, EnumTipoToast.error)
    })
  }



  //#endregion



}
