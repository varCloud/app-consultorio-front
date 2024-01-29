import { ComponentesCompartidosModule } from './../componentes-compartidos/componentes-compartidos.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotasMedicasRoutingModule } from './notas-medicas-routing.module';
import { AgregarNotaMedicaComponent } from './componentes/agregar-nota-medica/agregar-nota-medica.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbDatepickerModule, NgbTooltipModule, NgbAlert, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ArchwizardModule } from 'angular-archwizard';
import { NgxMaskModule } from 'ngx-mask';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { FeahterIconModule } from 'src/app/core/feather-icon/feather-icon.module';
import { QuillModule } from 'ngx-quill';
import { NotaMedicaComponent } from './nota-medica/nota-medica.component'

@NgModule({
  declarations: [AgregarNotaMedicaComponent, NotaMedicaComponent],
  imports: [
    CommonModule,
    NotasMedicasRoutingModule,
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
    QuillModule.forRoot(),
    ComponentesCompartidosModule,
    NgbAlertModule
  ]
})
export class NotasMedicasModule { }
