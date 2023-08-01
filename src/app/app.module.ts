import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';





import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { HttpClientModule } from '@angular/common/http';
import { httpInterceptorProviders } from './_helpers/http.interceptor';
// import { HashLocationStrategy, LocationStrategy } from '@angular/common';



@NgModule({
  declarations: [
    AppComponent,
    
    
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
    // {
    //   provide: LocationStrategy,
    //   useClass: HashLocationStrategy,
    // },
    // {
    //   provide: PERFECT_SCROLLBAR_CONFIG,
    //   useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    // },
    httpInterceptorProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
