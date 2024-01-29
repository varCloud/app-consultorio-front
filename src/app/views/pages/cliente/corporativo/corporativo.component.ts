import { CifrarService } from 'src/app/utils/Cifrar.service';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { ToastService } from './../../../../utils/toast.service';
import { ClienteService } from './../../../../servicios/cliente/cliente.service';
import { DataTable } from "simple-datatables";
import { Component, OnInit } from "@angular/core";
import { EnumTipoToast } from 'src/app/utils/toast.service';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';

@Component({
  selector: 'app-corporativo',
  templateUrl: './corporativo.component.html',
  styleUrls: ['./corporativo.component.scss']
})
export class CorporativoComponent implements OnInit {

  //variables para el componente de registro
  abrirModalRegistro: boolean = false;

  //variable para la tabla de clientes
  dataTable: any;
  limitRows=20;
  loaderTable = true;
  ColumnMode = ColumnMode;
  clientes: any;
  dataCliente;//variable para editar o ver
  clientesFiltrados: any = [];

  constructor(
    private router: Router,
    private toast: ToastService,
    private clienteService: ClienteService,
    private cifrarService: CifrarService
  ) { }

  ngOnInit(): void {
    //this.onInitElementos();
    this.obtenerClientes();
  }

  //#region INICIALIZACIONES

  onInitElementos() {
    this.dataTable = new DataTable("#tabla-clientes-corporativos", {
      //headings: ["nombreCompleto", "curp", "telefonoAdicional", "fechaNacimiento", "fechaAlta"],
      columns: [{ select: 5, sortable: false }],
    });
  }
  //#endregion INICIALIZACIONES

  //#region FUNCIONES INTERNAS
  crearFiltro() {
    this.clientesFiltrados = this.clientes
    this.clientesFiltrados.map((item: any) => {
      item.filtro =
        item.rfc +
        ' ' +
        item.razonSocial +
        ' ' +
        item.correo
    });
  }
  //#endregion FUNCIONES INTERNAS

  //#region WEB SERVICES
  obtenerClientes() {
    this.loaderTable = true;
    this.clienteService.obtenerClientesCorporativos({}).subscribe(data => {
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
    this.clienteService.actualizarEstadoClienteCorporativo(postData).subscribe((data: any) => {
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

  onDesactivar(item) {
    Swal.fire({
      title: 'Estas seguro que desea eliminar el registro?',
      confirmButtonText: 'Eliminar',
      confirmButtonColor: "#ff3366",
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.desactivarUsuario(item)
      }
    })
  }

  onPerfil(cliente) {
    let idClienteCorporativo = this.cifrarService.setEncString(cliente.idClienteCorporativo)
    this.router.navigate(["clientes/perfil-corporativo"], { queryParams: { cliente: idClienteCorporativo } });
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
