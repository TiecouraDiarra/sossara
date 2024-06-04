import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompleteProfilRoutingModule } from './complete-profil-routing.module';
import { CompleteProfilComponent } from './complete-profil.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { QuillModule } from 'ngx-quill';


@NgModule({
  declarations: [
    CompleteProfilComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    CompleteProfilRoutingModule,
    QuillModule.forRoot(), // ngx-quill
  ]
})
export class CompleteProfilModule { }
