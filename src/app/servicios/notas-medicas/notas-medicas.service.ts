import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotasMedicasService {

  url: String = environment.baseurl + 'notas/';
  constructor(private httpClient: HttpClient) { }


  guardarNotaMedica(data: any) {
    return this.httpClient.post(this.url + 'guardarNotaMedica', data);
  }

  obteneNotasMedicas(data: any) {
    return this.httpClient.post(this.url + 'obteneNotasMedicas', data);
  }
  
  obteneNotasMedicasXId(data: any) {
    return this.httpClient.post(this.url + 'obteneNotasMedicasXId', data);
  }

  obtenerUltimaNotaMedicaXPaciente(data: any) {
    return this.httpClient.post(this.url + 'obtenerUltimaNotaMedicaXPaciente', data);
  }

  obtenerNotaMedicaXPaciente(data: any) {
    return this.httpClient.post(this.url + 'obtenerNotaMedicaXPaciente', data);
  }
  
  


}