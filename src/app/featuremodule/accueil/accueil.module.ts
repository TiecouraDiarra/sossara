import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './accueil-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AccueilComponent } from './accueil.component';
import { SharedModule } from 'src/app/shared/shared/shared.module';

@NgModule({
  declarations: [AccueilComponent],
  imports: [CommonModule, HomeRoutingModule, HttpClientModule,SharedModule],
})
export class AccueilModule {}
