import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { FormsModule } from '@angular/forms';
import { ListerecuComponent } from './listerecu.component';
import { ListrecuRoutingModule } from './listerecu-routing.module';

@NgModule({
  declarations: [
    ListerecuComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ListrecuRoutingModule
  ]
})
export class ListerecuModule { }
