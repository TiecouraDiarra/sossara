import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserpagesRoutingModule } from './userpages-routing.module';
import { UserpagesComponent } from './userpages.component';
import { LocataireComponent } from './locataire/locataire.component';
import { ProprietaireComponent } from './proprietaire/proprietaire.component';
import { AgenceComponent } from './agence/agence.component';


@NgModule({
  declarations: [
    UserpagesComponent,
    LocataireComponent,
    ProprietaireComponent,
    AgenceComponent,
  ],
  imports: [
    CommonModule,
    UserpagesRoutingModule
  ]
})
export class UserpagesModule { }
