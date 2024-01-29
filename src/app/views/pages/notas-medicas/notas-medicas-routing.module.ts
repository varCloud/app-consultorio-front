import { NotaMedicaComponent } from './nota-medica/nota-medica.component';
import { AgregarNotaMedicaComponent } from './componentes/agregar-nota-medica/agregar-nota-medica.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
{path:'agregar-nota' , component: AgregarNotaMedicaComponent },
{path:'notas' , component: NotaMedicaComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotasMedicasRoutingModule { }
