import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { FormsModule } from '@angular/forms';
import { VisaComponent } from './visa.component';
import { VisaRoutingModule } from './visa-routing.module';


@NgModule({
  declarations: [
    VisaComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    VisaRoutingModule
  ]
})
export class GimModule { }
