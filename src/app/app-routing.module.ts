import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaseComponent } from './views/layout/base/base.component';
import { AuthGuard } from './core/guard/auth.guard';


const routes: Routes = [
  { path:'auth', loadChildren: () => import('./views/pages/auth/auth.module').then(m => m.AuthModule) },
  {
    path: '',
    component: BaseComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'pacientes',
        loadChildren: () => import('./views/pages/pacientes/pacientes.module').then(m => m.PacientesModule)
      },
      {
        path: 'notas',
        loadChildren: () => import('./views/pages/notas-medicas/notas-medicas.module').then(m => m.NotasMedicasModule)
      },
      {
        path: 'historial-medico',
        loadChildren: () => import('./views/pages/historial-medico/historial-medico.module').then(m => m.HistorialMedicoModule)
      },
      {
        path: 'perfil-doc',
        loadChildren: () => import('./views/pages/perfil-doc/perfil-doc.module').then(m => m.PerfilDocModule )
      },
      { path: '', redirectTo: 'pacientes/paciente', pathMatch: 'full' },

    ]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
