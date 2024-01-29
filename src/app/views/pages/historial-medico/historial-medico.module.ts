import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HistorialMedicoRoutingModule } from './historial-medico-routing.module';
import { HistorialComponent } from './historial/historial.component';
import { NgbDatepickerModule, NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { NgxMaskModule } from 'ngx-mask';
import { FeahterIconModule } from 'src/app/core/feather-icon/feather-icon.module';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ArchwizardModule } from 'angular-archwizard';
import { ComponentesCompartidosModule } from '../componentes-compartidos/componentes-compartidos.module';


@NgModule({
  declarations: [HistorialComponent],
  imports: [
    CommonModule,
    HistorialMedicoRoutingModule,
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
    FeahterIconModule,
    ComponentesCompartidosModule
  ]
})
export class HistorialMedicoModule { }
