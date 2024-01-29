import { Injectable } from '@angular/core';
import Swal from 'sweetalert2'

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor() { }

  mostrar(mensaje, tipo: EnumTipoToast) {
    switch (tipo) {
      case EnumTipoToast.success:
        Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 2500, title: mensaje, icon: 'success' })
        break;
      case EnumTipoToast.warning:
        Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 2500, title: mensaje, icon: 'warning' })
        break;
      case EnumTipoToast.error:
        Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 2500, title: mensaje, icon: 'error' })
        break;
      case EnumTipoToast.question:
        Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 2500, title: mensaje, icon: 'question' })
        break;
      case EnumTipoToast.info:
        Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 2500, title: mensaje, icon: 'info' })
        break;
    }
  }
}

export enum EnumTipoToast {
  success = 1,
  warning = 2,
  error = 3,
  question = 4,
  info = 5
}