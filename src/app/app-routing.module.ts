import { DashboardMvnoComponent } from './views/pages/usuario/root/dashboard-mvno/dashboard-mvno.component';
import { DistribuidorComponent } from './views/pages/usuario/distribuidor/distribuidor.component';
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
        path: 'dashboard',
        loadChildren: () => import('./views/pages/dashboard/dashboard.module').then(m => m.DashboardModule)
      },

      {
        path: 'clientes',
        loadChildren: () => import('./views/pages/cliente/cliente.module').then(m => m.ClienteModule)
      },
      {
        path: 'telefonia',
        loadChildren: () => import('./views/pages/telefonia/telefonia.module').then(m => m.TelefoniaModule)
      },
      {
        path: 'reporteria',
        loadChildren: () => import('./views/pages/reporteria/reporteria.module').then(m => m.ReporteriaModule)
      },
      {
        path: 'usuarios',
        loadChildren: () => import('./views/pages/usuario/usuario.module').then(m => m.UsuarioModule)
      },
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
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

    ]
  },
  {
    path: "dashboard-mvno",
    component: DashboardMvnoComponent,
    canActivate: [AuthGuard]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
