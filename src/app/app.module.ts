import { ColorPickerModule } from 'ngx-color-picker';
import { UsuarioModule } from './views/pages/usuario/usuario.module';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';

import { LayoutModule } from './views/layout/layout.module';
import { AuthGuard } from './core/guard/auth.guard';

import { AppComponent } from './app.component';
//import { ErrorPageComponent } from './views/pages/error-page/error-page.component';

import { HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorRediectService } from './core/http/interceptorRediect.service';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxMaskModule } from 'ngx-mask';
/* DatePipe en español */
import {LOCALE_ID } from '@angular/core';
import { registerLocaleData, LocationStrategy, HashLocationStrategy } from '@angular/common';
import es from '@angular/common/locales/es';

registerLocaleData(es);


@NgModule({
  declarations: [
    AppComponent,


    //ErrorPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    HttpClientModule,
    NgxDatatableModule,
    UsuarioModule,
    NgxMaskModule.forRoot(),
    ColorPickerModule

  ],
  providers: [
    AuthGuard,
    {
      provide: HIGHLIGHT_OPTIONS, // https://www.npmjs.com/package/ngx-highlightjs
      useValue: {
        coreLibraryLoader: () => import('highlight.js/lib/core'),
        languages: {
          xml: () => import('highlight.js/lib/languages/xml'),
          typescript: () => import('highlight.js/lib/languages/typescript'),
          scss: () => import('highlight.js/lib/languages/scss'),
        }
      }
    },
    //INTERCEPTOR DEL TOKEN
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorRediectService,
      multi: true
    },
    { provide: LOCALE_ID, useValue: 'es-*'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
