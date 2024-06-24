import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { FormsModule } from '@angular/forms';
import { GimComponent } from './gim.component';
import { GimRoutingModule } from './gim-routing.module';


@NgModule({
  declarations: [
    GimComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    GimRoutingModule
  ]
})
export class GimModule { }
