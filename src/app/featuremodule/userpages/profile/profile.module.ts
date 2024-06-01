import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { QuillModule } from 'ngx-quill';


@NgModule({
  declarations: [
    ProfileComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ProfileRoutingModule,
    QuillModule.forRoot(), // ngx-quill

  ]
})
export class ProfileModule { }
