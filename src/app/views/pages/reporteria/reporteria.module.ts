import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbCalendar, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReporteriaRoutingModule } from './reporteria-routing.module';
import { TransaccionesDiariasComponent } from './transacciones-diarias/transacciones-diarias.component';
import { FeahterIconModule } from 'src/app/core/feather-icon/feather-icon.module';
import { NgSelectModule } from '@ng-select/ng-select';

import { TransaccionesPorcanalComponent } from './transacciones-porcanal/transacciones-porcanal.component';
import { NgxMaskModule } from 'ngx-mask';
import { NgxCurrencyModule } from "ngx-currency";


@NgModule({
  declarations: [TransaccionesDiariasComponent, TransaccionesPorcanalComponent],
  imports: [
    CommonModule,
    ReporteriaRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    FeahterIconModule,
    NgSelectModule,
    NgxDatatableModule,
    NgxMaskModule,
    NgxCurrencyModule
  ]
})
export class ReporteriaModule { }
