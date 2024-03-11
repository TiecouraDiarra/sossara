import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactRoutingModule } from './contact-routing.module';
import { ContactComponent } from './contact.component';
import { FormsModule } from '@angular/forms';
import { MapComponent } from '../map/map.component';

@NgModule({
  declarations: [ContactComponent],
  imports: [FormsModule, CommonModule, ContactRoutingModule],
})
export class ContactModule {}
