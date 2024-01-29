import { HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  url: String = environment.baseurl + 'cliente/';

  constructor(private httpClient: HttpClient) {}

  registrarClienteMasivo(data: any) {
    return this.httpClient.post(this.url + 'registrarClienteMasivo',data);
  }

  registrarClienteCorporativo(data: any) {
    return this.httpClient.post(this.url + 'registrarClienteCorporativo', data);
  }

  obtenerClienteMasivo(data: any) {
    return this.httpClient.post(this.url + 'obtenerClienteMasivo', data);
  }

  obtenerClienteCorporativo(data: any) {
    return this.httpClient.post(this.url + 'obtenerClienteCorporativo', data);
  }

  obtenerClientesMasivos(data: any) {
    return this.httpClient.post(this.url + 'obtenerClientesMasivos', data);
  }

  obtenerClientesCorporativos(data: any) {
    return this.httpClient.post(this.url + 'obtenerClientesCorporativos', data);
  }

  actualizarEstadoClienteMasivo(data: any) {
    return this.httpClient.post(this.url + 'actualizarEstadoClienteMasivo', data);
  }

  actualizarEstadoClienteCorporativo(data: any) {
    return this.httpClient.post(this.url + 'actualizarEstadoClienteCorporativo', data);
  }

  obtenerSimsClienteMasivo(data: any) {
    return this.httpClient.post(this.url + 'obtenerSimsClienteMasivo', data);
  }

  asignarSimClienteMasivo(data: any) {
    return this.httpClient.post(this.url + 'asignarSimClienteMasivo', data);
  }

  obtenerColaboradoresClienteCorporativo(data: any) {
    return this.httpClient.post(this.url + 'obtenerColaboradoresClienteCorporativo', data);
  }

  desvincularSimClienteMasivo(data: any) {
    return this.httpClient.post(this.url + 'desvincularSimClienteMasivo', data);
  }
}
