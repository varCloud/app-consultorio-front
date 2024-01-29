import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuarioRoutingModule } from './usuario-routing.module';
import { DistribuidorComponent } from './distribuidor/distribuidor.component';
import { OperadorComponent } from './operador/operador.component';
import { CallcenterComponent } from './callcenter/callcenter.component';
import { MvnoComponent } from './mvno/mvno.component';
import { MdlregistroComponent } from './mvno/components/mdlregistro/mdlregistro.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdlRegistroDistribuidorComponent } from './distribuidor/componentes/mdl-registro-distribuidor/mdl-registro-distribuidor.component';

// Ngx-mask
import { NgxMaskModule, IConfig } from 'ngx-mask';

// Ng-select
import { NgSelectModule } from '@ng-select/ng-select';
import { MdlRegistroOperadorComponent } from './operador/componentes/mdl-registro-operador/mdl-registro-operador.component';
import { MdlRegistroCallCenterComponent } from './callcenter/componentes/mdl-registro-call-center/mdl-registro-call-center.component';
import { MdlCambiarContrasenaComponent } from './componentesCompartidos/mdl-cambiar-contrasena/mdl-cambiar-contrasena.component';
import { DashboardMvnoComponent } from './root/dashboard-mvno/dashboard-mvno.component';


@NgModule({
  declarations: [DistribuidorComponent, OperadorComponent, CallcenterComponent, MvnoComponent, MdlregistroComponent, MdlRegistroDistribuidorComponent, MdlRegistroOperadorComponent, MdlRegistroCallCenterComponent, MdlCambiarContrasenaComponent, DashboardMvnoComponent],
  imports: [
    CommonModule,
    UsuarioRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot({ validation: true}), // Ngx-mask
    NgSelectModule, // Ng-select
    NgxDatatableModule,
    NgxSkeletonLoaderModule
  ],
  exports: [
    DashboardMvnoComponent
  ]
})
export class UsuarioModule { }
