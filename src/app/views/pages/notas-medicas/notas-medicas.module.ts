import { ComponentesCompartidosModule } from './../componentes-compartidos/componentes-compartidos.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotasMedicasRoutingModule } from './notas-medicas-routing.module';
import { AgregarNotaMedicaComponent } from './componentes/agregar-nota-medica/agregar-nota-medica.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbDatepickerModule, NgbTooltipModule, NgbAlert, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
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
    NgxMaskDirective,
    NgbDropdownModule,
    NgbDatepickerModule,
    FeahterIconModule,
    NgbTooltipModule,
    QuillModule.forRoot(),
    ComponentesCompartidosModule,
    NgbAlertModule
  ],
  providers: [
    provideNgxMask({ validation: true })
  ]
})
export class NotasMedicasModule { }
