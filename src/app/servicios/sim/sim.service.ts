import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SimService {

  url: String = environment.baseurl + 'sim/';

  constructor(private httpClient: HttpClient) {}

  registrarEditarSim(data: any) {
    return this.httpClient.post(this.url + 'registrarEditarSim',data);
  }

  registrarMasivoSim(data: any) {
    return this.httpClient.post(this.url + 'registrarMasivoSim', data);
  }

  eliminarActivarSim(data: any) {
    return this.httpClient.post(this.url + 'eliminarActivarSim', data);
  }

  consultarSims(data: any) {
    return this.httpClient.post(this.url + 'consultarSims', data);
  }

  asignarSim(data: any) {
    return this.httpClient.post(this.url + 'asignarSim', data);
  }

  eliminarAsignacionSim(data: any) {
    return this.httpClient.post(this.url + 'eliminarAsignacionSim', data);
  }

  consultarEstatusSim(data: any) {
    return this.httpClient.post(this.url + 'consultarEstatusSim', data);
  }

  consultarDetalleSim(data: any) {
    return this.httpClient.post(this.url + 'consultarDetalleSim', data);
  }

  obtenerSimUsuario(data: any) {
    return this.httpClient.post(this.url + 'obtenerSimUsuario', data);
  }

  consultarProductosSim(data: any) {
    return this.httpClient.post(this.url + 'consultarProductosSim', data);
  }

  consultarEstatusAsignacion(data: any) {
    return this.httpClient.post(this.url + 'consultarEstatusAsignacion', data);
  }
}
