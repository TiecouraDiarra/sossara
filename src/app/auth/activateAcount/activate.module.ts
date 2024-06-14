import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActivateRoutingModule } from './activate-routing.module';
import { ActivateComponent } from './activate.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ActivateComponent],
  imports: [FormsModule, CommonModule, ActivateRoutingModule],
})
export class ActivateModule {}
