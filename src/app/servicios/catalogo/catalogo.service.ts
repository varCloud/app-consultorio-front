import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {

  url: String = environment.baseurl + 'catalogo/';

  constructor(private httpClient: HttpClient) { }

  obtenerTiposUsuarios(data: any) {
    return this.httpClient.post(this.url + 'obtenerTiposUsuarios', data);
  }

  obtenerTiposHitoriasClinicas(data: any) {
    return this.httpClient.get(this.url + 'obtenerTiposHitoriasClinicas');
  }


  obtenerPreguntasXHistoriaClinica(data: any) {
    return this.httpClient.post(this.url + 'obtenerPreguntasXHistoriaClinica',data);
  }



  obtenerTiposUsuariosPorRol(data: any) {
    return this.httpClient.post(this.url + 'obtenerTiposUsuariosPorRol', data);
  }

  obtenerMvno() {
    return this.httpClient.get(this.url + 'obtenerMvno');
  }

  obtenerDireccionCP(data: any) {
    return this.httpClient.post(this.url + 'obtenerDireccionCP', data);
  }
  obtenerDistribuidoresPorRol(data: any) {
    return this.httpClient.post(this.url + 'obtenerDistribuidoresPorRol', data);
  }

}
