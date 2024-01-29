import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PerfilDocRoutingModule } from './perfil-doc-routing.module';
import { PerfilComponent } from './perfil/perfil.component';
import { CustomFormsModule } from 'ngx-custom-validators';
import { ColorPickerModule } from 'ngx-color-picker';
import { NgbAlertModule, NgbDatepickerModule, NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ArchwizardModule } from 'angular-archwizard';
import { NgxMaskModule } from 'ngx-mask';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { FeahterIconModule } from 'src/app/core/feather-icon/feather-icon.module';
import { ComponentesCompartidosModule } from '../componentes-compartidos/componentes-compartidos.module';


@NgModule({
  declarations: [PerfilComponent],
  imports: [
    CommonModule,
    PerfilDocRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ColorPickerModule,
    CustomFormsModule,
    NgbAlertModule,
    NgxDatatableModule,
    NgxSkeletonLoaderModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot({ validation: true}),
    NgbDropdownModule,
    ArchwizardModule,
    NgbDatepickerModule,
    FeahterIconModule,
    NgbTooltipModule,
    ComponentesCompartidosModule,
    NgbAlertModule,
    ColorPickerModule
  ]
})
export class PerfilDocModule { }
