import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SignupRoutingModule } from './signup-routing.module';
import { SignupComponent } from './signup.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared/shared.module';

@NgModule({
  declarations: [SignupComponent],
  imports: [FormsModule, CommonModule, SignupRoutingModule,    SharedModule,
  ],
})
export class SignupModule {}
