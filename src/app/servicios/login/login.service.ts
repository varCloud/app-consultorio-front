
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  url: String = environment.baseurl + 'paciente/';

  constructor(private httpClient: HttpClient) {}

  login(data: any) {
    return this.httpClient.post(this.url + 'login', data);
  }
}
