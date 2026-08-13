import { MenuItem } from '../../entidades/menu.model';
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

}
