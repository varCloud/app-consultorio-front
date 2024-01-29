import { TransaccionesDiariasComponent } from './transacciones-diarias/transacciones-diarias.component';
import { TransaccionesPorcanalComponent } from './transacciones-porcanal/transacciones-porcanal.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
{
  path:'tran-diarias',
  component:TransaccionesDiariasComponent
},
{
  path:'tran-porcanal',
  component:TransaccionesPorcanalComponent
}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReporteriaRoutingModule { }
