import { EnumAsignacionSim, EnumEstatusSim } from './../entidades/enumeraciones';
import { EnumTipoUsuario } from 'src/app/entidades/enumeraciones';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColoresService {

  constructor() { }

  colorTipoUsuario(idTipoUsuario) {
    switch (idTipoUsuario) {
      case EnumTipoUsuario.Admin_MVNO:
        return {
          color: "primary",
          badge: "badge badge-primary"
        }
        break;

      case EnumTipoUsuario.Distribuidor:
        return {
          color: "success",
          badge: "badge badge-success"
        }

        break;

      case EnumTipoUsuario.Operador:
        return {
          color: "secondary",
          badge: "badge badge-secondary"
        }

        break;

      case EnumTipoUsuario.Soporte_Técnico:
        return {
          color: "danger",
          badge: "badge badge-danger"
        }
        break;

      default:
        break;
    }

  }

  colorEstatusAsignacion(idEstatusAsignacion) {
    switch (idEstatusAsignacion) {
      case EnumAsignacionSim.Asignada:
        return {
          color: "danger",
          badge: "badge badge-danger"
        }
        break;

      case EnumAsignacionSim.Disponible:
        return {
          color: "success",
          badge: "badge badge-success"
        }
        break;
      default:
        break;
    }

  }

  colorEstatusSim(idEstatusSim) {
    switch (idEstatusSim) {
      case EnumEstatusSim.Activa:
        return {
          color: "success",
          badge: "badge badge-success"
        }
        break;
        case EnumEstatusSim.Asignada:
        return {
          color: "secondary",
          badge: "badge badge-secondary"
        }
        break;

        case EnumEstatusSim.Inactiva:
        return {
          color: "light",
          badge: "badge badge-light"
        }
        break;

        case EnumEstatusSim.PorAsignar:
        return {
          color: "info",
          badge: "badge badge-info"
        }
        break;

        case EnumEstatusSim.Suspendida:
        return {
          color: "danger",
          badge: "badge badge-danger"
        }
        break;

        case EnumEstatusSim.Tansferida:
        return {
          color: "primary-muted",
          badge: "badge badge-primary-muted"
        }
        break;

        default:
          return {
            color: "dodger-blue",
            badge: "badge badge-dodger-blue"
          }
          break;
    }

  }

}
