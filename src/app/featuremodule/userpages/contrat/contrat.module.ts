import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { FormsModule } from '@angular/forms';
import { ContratRoutingModule } from './contrat-routing.module';
import { ContratComponent } from './contrat.component';
import { QuillModule } from 'ngx-quill';


@NgModule({
  declarations: [
    ContratComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ContratRoutingModule,
    QuillModule.forRoot(), // ngx-quill
  ]
})
export class FactureModule { }
