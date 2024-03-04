import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { FormsModule } from '@angular/forms';
import { FactureComponent } from './facture.component';
import { FactureRoutingModule } from './facture-routing.module';


@NgModule({
  declarations: [
    FactureComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    FactureRoutingModule
  ]
})
export class FactureModule { }
