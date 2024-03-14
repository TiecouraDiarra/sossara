import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { FormsModule } from '@angular/forms';
import { OrangeMoneyComponent } from './orange-money.component';
import { ProprietaireRoutingModule } from './orange-money-routing.module';


@NgModule({
  declarations: [
    OrangeMoneyComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ProprietaireRoutingModule
  ]
})
export class OrangeMoneyModule { }
