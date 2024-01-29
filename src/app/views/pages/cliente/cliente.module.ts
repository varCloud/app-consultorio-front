import { FeahterIconModule } from 'src/app/core/feather-icon/feather-icon.module';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MdlregistroCorporativoComponent } from './corporativo/componentes/mdlregistro/mdlregistrocorporativo.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxMaskModule } from 'ngx-mask';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClienteRoutingModule } from './cliente-routing.module';
import { MasivoComponent } from './masivo/masivo.component';
import { MdlregistroComponent } from './masivo/componentes/mdlregistro/mdlregistro.component';
import { CorporativoComponent } from './corporativo/corporativo.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MdlsimclienteComponent } from './mdlsimcliente/mdlsimcliente.component';
import { PerfilcorporativoComponent } from './corporativo/componentes/perfilcorporativo/perfilcorporativo.component';


@NgModule({
  declarations: [MasivoComponent, MdlregistroComponent, CorporativoComponent,MdlregistroCorporativoComponent, MdlsimclienteComponent, PerfilcorporativoComponent],
  imports: [
    CommonModule,
    ClienteRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot({ validation: true}), // Ngx-mask
    NgSelectModule, // Ng-select
    NgxDatatableModule,
    NgxSkeletonLoaderModule,
    NgbModule,
    FeahterIconModule
  ]
})
export class ClienteModule { }
