import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { SharethisAngularModule } from 'sharethis-angular';


@NgModule({
  declarations: [
    PagesComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    SharethisAngularModule // Assurez-vous d'importer SharethisAngularModule ici
  ]
})
export class PagesModule { }
