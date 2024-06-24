import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { ResetPasswordComponent } from './reset-password.component';
import { ResetPasswordRoutingModule } from './reset-password-routing.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ResetPasswordComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ResetPasswordRoutingModule
  ]
})
export class ResetPasswordModule { }
