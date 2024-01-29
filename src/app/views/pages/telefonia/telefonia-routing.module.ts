
import { AsignacionDeSimsComponent } from './asignacion-de-sims/asignacion-de-sims.component';
import { CargaDeSimsComponent } from './carga-de-sims/carga-de-sims.component';
import { AdministracionDeSimsComponent } from './administracion-de-sims/administracion-de-sims.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{
  path: 'admin-sims',
  component: AdministracionDeSimsComponent
},
{
  path: 'carga-sims',
  component: CargaDeSimsComponent
},
{
  path: 'asignacion-sims',
  component: AsignacionDeSimsComponent
},

]
  ;

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TelefoniaRoutingModule { }
