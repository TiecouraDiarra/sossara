import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { RdvRoutingModule } from './rdv-routing.module';



@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    RdvRoutingModule,
    FormsModule,
    Ng2SearchPipeModule
  ]
})
export class RdvModule { }
