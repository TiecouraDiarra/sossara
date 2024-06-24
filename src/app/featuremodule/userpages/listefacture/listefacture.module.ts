import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { FormsModule } from '@angular/forms';
import { ListefactureComponent } from './listefacture.component';
import { ListfactureRoutingModule } from './listefacture-routing.module';

@NgModule({
  declarations: [
    ListefactureComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ListfactureRoutingModule
  ]
})
export class ListefactureModule { }
