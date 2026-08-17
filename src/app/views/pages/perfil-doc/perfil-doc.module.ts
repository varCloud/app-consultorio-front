import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PerfilDocRoutingModule } from './perfil-doc-routing.module';
import { PerfilComponent } from './perfil/perfil.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { NgbAlertModule, NgbDatepickerModule, NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
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
    NgbAlertModule,
    NgxDatatableModule,
    NgxSkeletonLoaderModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    NgbDropdownModule,
    NgbDatepickerModule,
    FeahterIconModule,
    NgbTooltipModule,
    ComponentesCompartidosModule,
    NgbAlertModule,
    ColorPickerModule
  ],
  providers: [
    provideNgxMask({ validation: true })
  ]
})
export class PerfilDocModule { }
