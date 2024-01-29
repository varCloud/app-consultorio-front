import { ColorPickerModule } from 'ngx-color-picker';
import { ComponentesCompartidosModule } from './../componentes-compartidos/componentes-compartidos.module';
import { NgbDropdownModule, NgbDatepickerModule, NgbTooltipModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PacientesRoutingModule } from './pacientes-routing.module';
import { PacienteComponent } from './paciente/paciente.component';
import { TablaUsuariosComponent } from './componentes/tabla-usuarios/tabla-usuarios.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { MdlRegistraPacienteComponent } from './componentes/mdl-registra-paciente/mdl-registra-paciente.component';

// angular-archwizard
import { ArchwizardModule } from 'angular-archwizard';
import { FeahterIconModule } from 'src/app/core/feather-icon/feather-icon.module';
import { MdlHistoriaClinicaComponent } from './componentes/mdl-historia-clinica/mdl-historia-clinica.component';

@NgModule({
  declarations: [PacienteComponent, TablaUsuariosComponent, MdlRegistraPacienteComponent, MdlHistoriaClinicaComponent],
  imports: [
    CommonModule,
    PacientesRoutingModule,
    NgxDatatableModule,
    NgxSkeletonLoaderModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot({ validation: true}),
    NgbDropdownModule,
    ArchwizardModule,
    NgxMaskModule.forRoot(),
    NgbDatepickerModule,
    FeahterIconModule,
    NgbTooltipModule,
    ComponentesCompartidosModule,
    NgbAlertModule,
    ColorPickerModule

  ]
})
export class PacientesModule { }
