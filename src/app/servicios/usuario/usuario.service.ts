import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  url: String = environment.baseurl + 'paciente/';

  constructor(private httpClient: HttpClient) { }

  login(data: any) {
    return this.httpClient.post(this.url + 'login', data);
  }

  obtenerPacientes(data: any) {
    return this.httpClient.post(this.url + 'obtenerPacientes', data);
  }

  registrarUsuario(data: any) {
    return this.httpClient.post(this.url + 'obtenerPacientes', data);
  }

  obtenerUsuarioslogin(data: any) {
    return this.httpClient.post(this.url + 'obtenerUsuarios', data);
  }

  actualizarEstadoUsuario(data: any) {
    return this.httpClient.post(this.url + 'actualizarEstadoUsuario', data);
  }

  obtenerUsuariosPorUsuario(data: any) {
    return this.httpClient.post(this.url + 'obtenerUsuariosPorUsuario', data);
  }

  registrarUsuarioDistribuidor(data: any) {
    return this.httpClient.post(this.url + 'registrarUsuarioDistribuidor', data);
  }

  cambiarContrasena(data: any) {
    return this.httpClient.post(this.url + 'cambiarContrasena', data);
  }

  actualizarPerfilUsuario(data: any) {
    return this.httpClient.post(this.url + 'actualizarPerfilUsuario', data);
  }

}
