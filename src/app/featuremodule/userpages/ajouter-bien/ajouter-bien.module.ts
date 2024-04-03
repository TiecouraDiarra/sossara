import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AjouterBienRoutingModule } from './ajouter-bien-routing.module';
import { AjouterBienComponent } from './ajouter-bien.component';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';




@NgModule({
  declarations: [
    AjouterBienComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    AjouterBienRoutingModule,
    SharedModule,
    QuillModule.forRoot(), // ngx-quill
  ]
})
export class AjouterBienModule { }
