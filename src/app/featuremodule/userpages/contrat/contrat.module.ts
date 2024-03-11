import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { FormsModule } from '@angular/forms';
import { ContratRoutingModule } from './contrat-routing.module';
import { ContratComponent } from './contrat.component';


@NgModule({
  declarations: [
    ContratComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ContratRoutingModule
  ]
})
export class FactureModule { }
