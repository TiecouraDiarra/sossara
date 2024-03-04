import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { FormsModule } from '@angular/forms';
import { RecuComponent } from './recu.component';
import { RecuRoutingModule } from './recu-routing.module';


@NgModule({
  declarations: [
    RecuComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RecuRoutingModule
  ]
})
export class FactureModule { }
