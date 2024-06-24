import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { FormsModule } from '@angular/forms';
import { ModifierBienRoutingModule } from './modifier-bien-routing.module';
import { ModifierBienComponent } from './modifier-bien.component';
import { QuillModule } from 'ngx-quill';
import { SharedModule } from 'src/app/shared/shared/shared.module';


@NgModule({
  declarations: [
    ModifierBienComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ModifierBienRoutingModule,
    SharedModule,
    QuillModule.forRoot(), // ngx-quill
  ]
})
export class ModifierBienModule { }
