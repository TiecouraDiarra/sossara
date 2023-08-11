import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddListingRoutingModule } from './add-listing-routing.module';
import { AddListingComponent } from './add-listing.component';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    AddListingComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    AddListingRoutingModule,
    SharedModule
  ]
})
export class AddListingModule { }
