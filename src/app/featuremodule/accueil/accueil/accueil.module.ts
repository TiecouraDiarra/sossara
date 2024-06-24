import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccueilRoutingModule } from './accueil-routing.module';
// import { AccueilComponent } from './accueil.component';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { AccueilComponent } from './accueil.component';
import { HeaderAccueilComponent } from './header-accueil/header-accueil.component';
import { FooterAccueilComponent } from './footer-accueil/footer-accueil.component';


@NgModule({
  declarations: [
    AccueilComponent,
    HeaderAccueilComponent,
    FooterAccueilComponent
  ],
  imports: [
    CommonModule,
    AccueilRoutingModule,
    SharedModule
  ]
})
export class HomeNineModule { }
