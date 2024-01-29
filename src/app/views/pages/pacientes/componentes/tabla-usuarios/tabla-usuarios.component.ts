import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { UsuarioService } from 'src/app/servicios/usuario/usuario.service';
import { SesionService } from 'src/app/utils/sesion.service';
import { ToastService } from 'src/app/utils/toast.service';

@Component({
  selector: 'app-tabla-usuarios',
  templateUrl: './tabla-usuarios.component.html',
  styleUrls: ['./tabla-usuarios.component.scss']
})
export class TablaUsuariosComponent implements OnInit {

  @Input() set PintarTabla(model: any) {
    //this.model = model;
      this.lstUsuarios = model
      this.crearFiltro();
      setTimeout(() => {
        this.loaderTable = false;
      }, 500);
  }

  @Output() OutPutOnVer = new EventEmitter<any>();
  @Output() OutPutOnEditar = new EventEmitter<any>();
  @Output() OutPutOnDesactivar = new EventEmitter<any>();
  @Output() OutPutOnAgregarNota = new EventEmitter<any>();
  @Output() OutPutOnUltimaNota = new EventEmitter<any>();

  
  model: any = { abrir: false };
  limitRows=20;
  //variables para el componente de edicion
  abrirModalEditar: boolean = false;

   //variables para el componente de cambiar contrasena
  modelContrasena: any = { abrir: false };
  mvno: any;
  lstUsuarios = []
  columns = ["Nombre", "Usuario", "Correo", "Email", "Fecha Alta", "Acciones"]
  ColumnMode = ColumnMode;
  loaderTable=true;
  filteredData: any = [];

  constructor(private modalService: NgbModal,
    private sesionService: SesionService,
    private usuarioService: UsuarioService,
    private toastService: ToastService

  ) {
    this.loaderTable=true;
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
  }


  //#region EVENTOS

  onCerrarModalContrasena(data) {
  }

  onEditar(item) {
    this.OutPutOnEditar.emit(item)
  }

  onDesactivar(item) {
    this.OutPutOnDesactivar.emit(item)
    /*Swal.fire({
      title: 'Estas seguro que desea eliminar el registro?',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      icon: 'question',
    }).then((result) => {
      if (result.isConfirmed) {
        this.desactivarUsuario(item)
      }
    })*/
  }

  onVer(item) {
    //this.model = { abrir: true, ...item, editar: false ,ver: true }
    this.OutPutOnVer.emit(item)
  }

  crearFiltro() {
    this.filteredData = this.lstUsuarios
    this.filteredData.map((item: any) => {
      item.filtro =
        item.nombres + item.apellidoPaterno + item.apellidoMaterno+
        '' +
        item.idPaciente +
        '' +
        item.telefono
    });
  }

  updateFilter(value: any) {
    if (value === '') {
      this.filteredData = this.lstUsuarios;
    } {
      const filtered = this.lstUsuarios.filter((data: any) => {
        return data.filtro.toLowerCase().includes(value.toLowerCase().replace(/ /g,''));
      });
      this.filteredData = filtered
    }

  }

  onAgregarNota(data){
    //this.modelContrasena = { abrir: true , ...data};
    this.OutPutOnAgregarNota.emit(data);
  }

  onUltimaNota(data){
    this.OutPutOnUltimaNota.emit(data);
  }

  //#endregion EVENTOS
  //#region  WEB SERVICES
  //#endregion

}
