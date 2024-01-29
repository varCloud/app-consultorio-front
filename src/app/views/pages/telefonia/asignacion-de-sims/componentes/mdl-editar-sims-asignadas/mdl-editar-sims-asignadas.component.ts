import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { EnumAsignacionSim } from 'src/app/entidades/enumeraciones';
import { CatalogoService } from 'src/app/servicios/catalogo/catalogo.service';
import { SimService } from 'src/app/servicios/sim/sim.service';
import { UsuarioService } from 'src/app/servicios/usuario/usuario.service';
import { SesionService } from 'src/app/utils/sesion.service';
import { EnumTipoToast, ToastService } from 'src/app/utils/toast.service';

@Component({
  selector: 'app-mdl-editar-sims-asignadas',
  templateUrl: './mdl-editar-sims-asignadas.component.html',
  styleUrls: ['./mdl-editar-sims-asignadas.component.scss']
})
export class MdlEditarSimsAsignadasComponent implements OnInit {

  @ViewChild("modalEditarAsigSim") contentModal: Element;
  model: any;
  @Input() set AbrirModal(model: any) {
    this.model = model;
    if (model.abrir) this.abrirModal();
  }
  @Output() cerrarModal = new EventEmitter<any>();
  tituloModal = "Editar Sims Asignadas"
  idEstatusSim: any;
  lstSims = []
  lstSimsPorAsignar = []
  filteredData = [];
  idEstatusAsignacionSim: EnumAsignacionSim = EnumAsignacionSim.Disponible
  ColumnMode = ColumnMode;
  selected = [];
  SelectionType = SelectionType;
  paginaActual = 1;
  paginasAgregadas = []
  limitRows = 20

  constructor(
    private modalService: NgbModal,
    public formBuilder: FormBuilder,
    private toastService: ToastService,
    private catalogoService: CatalogoService,
    private usuarioService: UsuarioService,
    public sesionService: SesionService,
    private simService: SimService
  ) { }


  ngOnInit(): void {
  }


  onSelect({ selected }) {
    console.log('Select Event', selected, this.selected);
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  onPage(event) {
    setTimeout(() => {
      console.log('paged!', event);
      this.paginaActual = event.offset + 1
    }, 100);
  }

  onPaginaActual() {
    let index = this.limitRows * this.paginaActual
    let indexIni = index - this.limitRows
    console.log("indexIni", indexIni, "index", index)
    if (this.paginasAgregadas.findIndex(x => x == this.paginaActual) == -1) {
      this.filteredData.filter(x => x.inx >= indexIni && x.inx < index).forEach((item) => {
        this.selected.push(item)
      })
    }
    console.log(this.selected)
  }

  onSeleccionarTodo() {

    this.selected = []
    this.selected.push(...this.filteredData);
    this.toastService.mostrar("Seleccionaste " + this.selected.length + " sims para asignar", EnumTipoToast.info)
  }

  onLimpiarTodo() {
    this.selected = []
    this.paginasAgregadas = [];

  }

  abrirModal() {
    console.log(this.model)
    this.obtenerSims();
    this.modalService.open(this.contentModal, { size: "xl", centered: true, backdrop: 'static', keyboard: false }).result.then((result) => {
      console.log(result)
      this.onLimpiarTodo();
      this.filteredData = []
      this.cerrarModal.next(undefined);
    }).catch((res) => { });
  }

  updateFilter(value: any) {
    if (value === '') {
      this.filteredData = this.lstSims;
    } else {
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

  adelante() {

  }

  atras() {

  }
  //#endregion

  obtenerSims() {
    let postData = {
      idUsuario: this.model.idUsuario
    }
    this.simService.obtenerSimUsuario(postData).subscribe((data: any) => {
      if (data.estatus == 200) {
        this.lstSims = [];
        this.lstSims = data.modelo;
        this.selected = []
        this.lstSims.forEach((item, index) => {

          item.seleccionado = false
          item.idUsuarioDistribuidor = this.model.idUsuario
          item.inx = index
        })
        this.crearFiltro();
      }
    }, err => { this.toastService.mostrar(err.message, EnumTipoToast.info) })
  }

  liberarSimsUsuario() {
    if (this.selected.length > 0) {
      this.simService.eliminarAsignacionSim(this.selected).subscribe((data: any) => {
        if (data.estatus == 200) {
          this.toastService.mostrar(data.mensaje, EnumTipoToast.success)
          this.obtenerSims();
        }
      })
    } else {
      this.toastService.mostrar("seleccione al menos una sim para asignar", EnumTipoToast.info)
    }
  }


}
