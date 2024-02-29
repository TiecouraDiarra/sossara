import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { FormsModule } from '@angular/forms';
import { ProprietaireComponent } from './proprietaire.component';
import { ProprietaireRoutingModule } from './proprietaire-routing.module';


@NgModule({
  declarations: [
    ProprietaireComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ProprietaireRoutingModule
  ]
})
export class ProprietaireModule { }
