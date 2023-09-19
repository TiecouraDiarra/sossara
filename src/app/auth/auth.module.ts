import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { FormsModule } from '@angular/forms';
// import { ResetPasswordComponent } from './reset-password/reset-password.component';

@NgModule({
  declarations: [AuthComponent],
  imports: [
    FormsModule,
    CommonModule, 
    AuthRoutingModule],
})
export class AuthModule {}
