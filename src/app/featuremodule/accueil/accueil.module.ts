import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './accueil-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AccueilComponent } from './accueil.component';

@NgModule({
  declarations: [AccueilComponent],
  imports: [CommonModule, HomeRoutingModule, HttpClientModule],
})
export class AccueilModule {}
