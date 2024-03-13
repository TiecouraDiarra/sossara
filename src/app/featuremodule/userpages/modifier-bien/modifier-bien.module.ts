import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { FormsModule } from '@angular/forms';
import { ModifierBienRoutingModule } from './modifier-bien-routing.module';
import { ModifierBienComponent } from './modifier-bien.component';


@NgModule({
  declarations: [
    ModifierBienComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ModifierBienRoutingModule
  ]
})
export class ModifierBienModule { }
