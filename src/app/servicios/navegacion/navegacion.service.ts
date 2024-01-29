import { MenuItem } from '../../entidades/menu.model';
import { EnumTipoUsuario } from './../../entidades/enumeraciones';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SesionService } from 'src/app/utils/sesion.service';

@Injectable({
  providedIn: 'root'
})
export class NavegacionService {

  constructor(private sesionService: SesionService) { }

  getNavigationItems(): Observable<MenuItem[]> {
        return of(this.menuRootMVNO);
  }

  menuRootMVNO =
    [
      {
        label: 'Menu',
        isTitle: true
      },
      {
        label: 'Pacientes',
        icon: 'user',
        link: '/pacientes/paciente'
      },
      {
        label: 'Notas Medicas',
        icon: 'file-text',
        link: '/notas/notas'
      },
      {
        label: 'Historial Medico',
        icon: 'book',
        link: '/historial-medico/historial'
      },
      // {
      //   label: 'Historial Medico',
      //   icon: 'book',
      //   link: '/perfil-doc/perfil'
      // }


    ];

  menuAdministradorMVNO = [
    {
      label: 'Menu',
      isTitle: true
    },
    {
      label: 'Dashboard',
      icon: 'home',
      link: '/dashboard'
    },
    {
      label: 'Administración de usuarios',
      isTitle: true
    },
    {
      label: 'Usuarios',
      icon: 'award',
      subItems: [
        {
          label: 'Distribuidor', //perfil admin mvno
          link: '/usuarios/distribuidor'
        },
        {
          label: 'Operador',
          link: '/usuarios/operador'
        },
        {
          label: 'Atención a clientes',
          link: '/usuarios/call-center'
        },
      ]
    },
    {
      label: 'Administración de MVNO',
      isTitle: true
    },
    {
      label: 'Telefonia',
      icon: 'phone-call',
      subItems: [
        {
          label: 'Administración de SIMS',
          link: '/telefonia/admin-sims',
        },
        {
          label: 'Carga de SIMS',
          link: '/telefonia/carga-sims'
        },
        {
          label: 'Asignación de SIMS',
          link: '/telefonia/asignacion-sims'
        }
      ]
    },

    {
      label: 'Administración de clientes',
      isTitle: true
    },
    {
      label: 'Clientes',
      icon: 'user',
      subItems: [
        {
          label: 'Masivos',
          link: '/clientes/masivo',
        },
        {
          label: 'Corporativos',
          link: '/clientes/corporativo',
        }
      ]
    },
    {
      label: 'Reporteria',
      isTitle: true
    },
    {
      label: 'Reportes',
      icon: 'user',
      subItems: [
        {
          label: 'Ventas diarias',
          link: '/reporteria/tran-diarias',
        },
        {
          label: 'Ofertas más vendidas',
          link: '/reporteria/tran-masvendidas',
        },
        {
          label: 'Ventas por canal',
          link: '/reporteria/tran-porcanal',
        },
      ]
    },

  ];

  menuOperador = [
    {
      label: 'Sims',
      isTitle: true
    },
    {
      label: 'Telefonia',
      icon: 'phone-call',
      subItems: [
        {
          label: 'SIMS asignadas',
          link: '/telefonia/sims-asignadas'
        },
      ]
    },
    {
      label: 'Administración de clientes',
      isTitle: true
    },
    {
      label: 'Clientes',
      icon: 'user',
      subItems: [
        {
          label: 'Masivos',
          link: '/clientes/masivo',
        },
        {
          label: 'Corporativos',
          link: '/clientes/corporativo'
        }
      ]
    },
  ]

  menuSoporteTecnico = [
    {
      label: 'Sims',
      isTitle: true
    },
    {
      label: 'Telefonia',
      icon: 'phone-call',
      subItems: [
        {
          label: 'SIMS asignadas',
          link: '/telefonia/sims-asignadas'
        },
      ]
    },
    {
      label: 'Administración de clientes',
      isTitle: true
    },
    {
      label: 'Clientes',
      icon: 'user',
      subItems: [
        {
          label: 'Masivos',
          link: '/clientes/masivo',
        },
        {
          label: 'Corporativos',
          link: '/clientes/corporativo'
        }
      ]
    },
  ]

  menuDistribubidor = [

    {
      label: 'Usuarios',
      icon: 'award',
      subItems: [
        {
          label: 'Operador',
          link: '/usuarios/operador'
        },
        {
          label: 'Atención a clientes',
          link: '/usuarios/call-center'
        },
      ]
    },
    {
      label: 'Sims',
      isTitle: true
    },
    {
      label: 'Telefonia',
      icon: 'phone-call',
      subItems: [
        {
          label: 'SIMS asignadas',
          link: '/telefonia/sims-asignadas'
        },
      ]
    },
    {
      label: 'Administración de clientes',
      isTitle: true
    },
    {
      label: 'Clientes',
      icon: 'user',
      subItems: [
        {
          label: 'Masivos',
          link: '/clientes/masivo',
        },
        {
          label: 'Corporativos',
          link: '/clientes/corporativo'
        }
      ]
    }
  ]

}
