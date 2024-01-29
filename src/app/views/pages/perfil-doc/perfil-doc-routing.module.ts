import { PerfilComponent } from './perfil/perfil.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ColorPickerModule } from 'ngx-color-picker';

const routes: Routes = [
  { path:'perfil' , component: PerfilComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes),

  ],
  exports: [RouterModule]
})
export class PerfilDocRoutingModule { }
