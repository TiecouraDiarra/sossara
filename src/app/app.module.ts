import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';





import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HttpRequestInterceptor } from './_helpers/http.interceptor';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
// import { HashLocationStrategy, LocationStrategy } from '@angular/common';



@NgModule({
  declarations: [
    AppComponent,
    
    // SegmentedControlComponent,
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    HttpClientModule,
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot()
    
  ],
  providers: [

     // Injectez LOCALE_ID et définissez la locale en français
     { provide: LOCALE_ID, useValue: 'fr-FR' },
    // {
    //   provide: LocationStrategy,
    //   useClass: HashLocationStrategy,  
    // }, 
    // { 
    //   provide: PERFECT_SCROLLBAR_CONFIG, 
    //   useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    // },
    // httpInterceptorProviders
    // Ajoutez l'intercepteur à la liste des fournisseurs
    // { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    // Enregistrez les données de la locale en français
    registerLocaleData(localeFr, 'fr');
  }
}
