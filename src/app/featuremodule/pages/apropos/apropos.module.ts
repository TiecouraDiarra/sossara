import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {AproposRoutingModule } from './apropos-routing.module';
import { AproposComponent } from './apropos.component';
import { SharedModule } from 'src/app/shared/shared/shared.module';


@NgModule({
  declarations: [
    AproposComponent
  ],
  imports: [
    CommonModule,
    AproposRoutingModule,
    SharedModule
  ]
})
export class AproposModule { }
