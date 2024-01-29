import { PerfilcorporativoComponent } from './corporativo/componentes/perfilcorporativo/perfilcorporativo.component';
import { CorporativoComponent } from './corporativo/corporativo.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MasivoComponent } from './masivo/masivo.component';

const routes: Routes = [
  {
    path: "masivo",
    component: MasivoComponent
  },
  {
    path: "corporativo",
    component: CorporativoComponent
  },
  {
    path: "perfil-corporativo",
    component: PerfilcorporativoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClienteRoutingModule { }
