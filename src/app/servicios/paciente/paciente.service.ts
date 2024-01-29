import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  url: String = environment.baseurl + 'paciente/';
  constructor(private httpClient: HttpClient) { }


  registrarPaciente(data: any) {
    return this.httpClient.post(this.url + 'registrarPaciente', data);
  }

  guardarRespuestaHistoriaClinica(data: any) {
    return this.httpClient.post(this.url + 'guardarRespuestaHistoriaClinica', data);
  }

  obtenerPreguntasRespuestasXPaciente(data: any) {
    return this.httpClient.post(this.url + 'obtenerPreguntasRespuestasXPaciente', data);
  }
  obtenerPacienteXId(data: any) {
    return this.httpClient.post(this.url + 'obtenerPacienteXId', data);
  }





}
