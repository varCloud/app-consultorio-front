import { DashboardMvnoComponent } from './root/dashboard-mvno/dashboard-mvno.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CallcenterComponent } from './callcenter/callcenter.component';
import { DistribuidorComponent } from './distribuidor/distribuidor.component';
import { MvnoComponent } from './mvno/mvno.component';
import { OperadorComponent } from './operador/operador.component';

const routes: Routes = [
  {
    path: "mvno",
    component: MvnoComponent
  },
  {
    path: "distribuidor",
    component: DistribuidorComponent
  },
  {
    path: "operador",
    component: OperadorComponent
  },
  {
    path: "call-center",
    component: CallcenterComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuarioRoutingModule { }
