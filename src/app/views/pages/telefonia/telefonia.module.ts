import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NgxMaskModule } from 'ngx-mask';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TelefoniaRoutingModule } from './telefonia-routing.module';
import { AdministracionDeSimsComponent } from './administracion-de-sims/administracion-de-sims.component';
import { CargaDeSimsComponent } from './carga-de-sims/carga-de-sims.component';
import { MdlRegistrarSimsPlantillaComponent } from './carga-de-sims/componentes/mdl-registrar-sims-plantilla/mdl-registrar-sims-plantilla.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AsignacionDeSimsComponent } from './asignacion-de-sims/asignacion-de-sims.component';
import { NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { MdlRegistrarSimComponent } from './administracion-de-sims/componentes/mdl-registrar-sim/mdl-registrar-sim.component';
import { MdlAsignarSimComponent } from './asignacion-de-sims/componentes/mdl-asignar-sim/mdl-asignar-sim.component';
import { MdlSimsAsignadasComponent } from './asignacion-de-sims/componentes/mdl-sims-asignadas/mdl-sims-asignadas.component';
import { MdlEditarSimsAsignadasComponent } from './asignacion-de-sims/componentes/mdl-editar-sims-asignadas/mdl-editar-sims-asignadas.component';



@NgModule({
  declarations: [
    AdministracionDeSimsComponent, 
    CargaDeSimsComponent, 
    MdlRegistrarSimsPlantillaComponent, AsignacionDeSimsComponent, MdlRegistrarSimComponent, MdlAsignarSimComponent, MdlSimsAsignadasComponent, MdlEditarSimsAsignadasComponent,   
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    TelefoniaRoutingModule,
    NgSelectModule,
    NgbTooltipModule,
    NgxMaskModule.forRoot({ validation: true}), // Ngx-mask
    NgxSkeletonLoaderModule,
    NgbDropdownModule
  ]
})
export class TelefoniaModule { }
