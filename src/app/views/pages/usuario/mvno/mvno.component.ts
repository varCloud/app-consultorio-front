import { Component, OnInit } from '@angular/core';
import { DataTable } from "simple-datatables";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-mvno',
  templateUrl: './mvno.component.html',
  styleUrls: ['./mvno.component.scss']
})
export class MvnoComponent implements OnInit {

  //variables para el componente de registro
  abrirModalRegistro: boolean = false;

  //variables para el componente de edicion
  abrirModalEditar: boolean = false;
  mvno:any;

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
    this.onInitElementos()
  }

  //#region INICIALIZACIONES

  onInitElementos() {
    const dataTable = new DataTable("#tablaMVNO",{
      columns: [
        { select: 5,sortable:false},
      ]
    });
  }

  //#endregion INICIALIZACIONES


  //#region EVENTOS
  onAbrirModalRegistro() {
    this.abrirModalRegistro = true;
  }

  onCerrarModalRegistro(data) {
    if (data) {
      if (data.status == 200) {
        //refresca la tabla
      }
    } else {

    }
    this.abrirModalRegistro = false;
  }

  onEditar(){
    console.log("Entroooooo")
    this.abrirModalEditar = true;
    this.mvno = {nombre: "Edson", PrimerApellido: "Ejemplo", id: Math.random()}
    console.log(this.mvno)
  }

  //#region EVENTOS
}
