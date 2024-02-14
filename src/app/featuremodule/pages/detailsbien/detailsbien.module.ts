import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DetailsbienRoutingModule } from './detailsbien-routing.module';
import { DetailsbienComponent } from './detailsbien.component';
import { SharedModule } from 'src/app/shared/shared/shared.module';


@NgModule({
  declarations: [
    DetailsbienComponent
  ],
  imports: [
    CommonModule,
    DetailsbienRoutingModule,
    SharedModule
  ]
})
export class DetailsbienModule { }
