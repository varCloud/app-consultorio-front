import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class ReporteriaService {
  url: String = environment.baseurlReporteria + 'crm/';

  constructor(private httpClient: HttpClient) {}

  getReporteVentas(data: any) {
    return this.httpClient.post(this.url + 'reporteVentas', data);
  }

  getOfertasMasVendidas(data: any) {
    return this.httpClient.post(this.url + 'ofertasMasVendidas', data);
  }

  getVentasPorCanal(data: any) {
    return this.httpClient.post(this.url + 'ventasPorCanal', data);
  }

}
