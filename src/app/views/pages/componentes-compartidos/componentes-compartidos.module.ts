import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentesCompartidosRoutingModule } from './componentes-compartidos-routing.module';
import { MdlUltimaNotaComponent } from './mdl-ultima-nota/mdl-ultima-nota.component';



@NgModule({
  declarations: [MdlUltimaNotaComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentesCompartidosRoutingModule
  ]
  ,exports:[]
})
export class ComponentesCompartidosModule { }
