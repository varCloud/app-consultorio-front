import { ColumnMode } from '@swimlane/ngx-datatable';
import { ToastService } from './../../../../utils/toast.service';
import { ClienteService } from './../../../../servicios/cliente/cliente.service';
import { DataTable } from "simple-datatables";
import { Component, OnInit } from "@angular/core";
import { EnumTipoToast } from 'src/app/utils/toast.service';
import Swal from 'sweetalert2'

@Component({
  selector: "app-masivo",
  templateUrl: "./masivo.component.html",
  styleUrls: ["./masivo.component.scss"],
})
export class MasivoComponent implements OnInit {

  //variables para abrir modales
  abrirModalRegistro: boolean = false;
  abrirModalSIM: boolean = false;

  //variable para la tabla de clientes
  dataTable: any;
  limitRows=20;
  loaderTable = true;
  ColumnMode = ColumnMode;
  clientes: any;
  dataCliente;//variable para editar o ver
  clientesFiltrados: any = [];

  constructor(
    private toast: ToastService,
    private clienteService: ClienteService
  ) { }

  ngOnInit(): void {
    this.obtenerClientes();
  }

  //#region INICIALIZACIONES

  onInitElementos() {
    this.dataTable = new DataTable("#tabla-clientes-masivos", {
      //headings: ["nombreCompleto", "curp", "telefonoAdicional", "fechaNacimiento", "fechaAlta"],
      //columns: [{ select: 6, sortable: false, searchable:false }],
      select: true,
    });
  }
  //#endregion INICIALIZACIONES

  //#region FUNCIONES INTERNAS
  crearFiltro() {
    this.clientesFiltrados = this.clientes
    this.clientesFiltrados.map((item: any) => {
      item.filtro =
        item.nombreCompleto +
        ' ' +
        item.idClienteMasivo +
        ' ' +
        item.curp +
        ' ' +
        item.correo
    });
  }
  //#endregion FUNCIONES INTERNAS

  //#region WEB SERVICES
  obtenerClientes() {
    this.loaderTable = true;
    this.clienteService.obtenerClientesMasivos({}).subscribe((data: any) => {
      this.onSuccessObtenerClientes(data);
      this.loaderTable = false;
    }, err => {
      this.toast.mostrar(err.message, EnumTipoToast.error);
      this.loaderTable = false;
    })
  }

  onSuccessObtenerClientes(data) {
    if (data.estatus == 200) {
      this.clientes = data.modelo;
      this.crearFiltro();
    } else {
      this.toast.mostrar(data.mensaje, EnumTipoToast.info)
    }
  }

  desactivarUsuario(item) {
    let postData = { ...item, estatus: 0 }
    this.clienteService.actualizarEstadoClienteMasivo(postData).subscribe((data: any) => {
      if (data.estatus == 200) {
        this.toast.mostrar(data.mensaje, EnumTipoToast.success)
        this.obtenerClientes();
      } else {
        this.toast.mostrar(data.mensaje, EnumTipoToast.info)
      }
    }, err => {
      this.toast.mostrar(err.message, EnumTipoToast.error)
    })
  }
  //#endregion WEB SERVICES

  //#region EVENTOS
  onAbrirModalRegistro() {
    this.abrirModalRegistro = true;
  }

  onCerrarModalRegistro(data) {
    if (data) {
      if (data.status == 200) {
        this.obtenerClientes();
      }
    } else {
    }
    this.abrirModalRegistro = false;
  }

  onEditar(cliente) {
    this.abrirModalRegistro = true;
    this.dataCliente = {
      cliente: cliente,
      habilitarForm: true
    }
  }

  onVer(cliente) {
    this.abrirModalRegistro = true;
    this.dataCliente = {
      cliente: cliente,
      habilitarForm: false
    }
  }

  onDesactivar(cliente) {
    Swal.fire({
      title: 'Estas seguro que desea eliminar el registro?',
      confirmButtonText: 'Eliminar',
      confirmButtonColor: "#ff3366",
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.desactivarUsuario(cliente)
      }
    })
  }

  onAsignarSIM(cliente) {
    this.abrirModalSIM = true;
    this.dataCliente = {
      cliente: cliente,
      habilitarForm: false
    }
  }

  onCerrarModalSim(data) {
    if (data) {

    } else {
    }
    this.abrirModalSIM = false;
  }

  onActualizarFiltro(value: any) {
    if (value === '') {
      this.clientesFiltrados = this.clientes;
    } else {
      this.clientesFiltrados = this.clientes.filter((data: any) => {
        return data.filtro.toLowerCase().includes(value.toLowerCase());
      });
    }
  }
  //#endregion EVENTOS

}
