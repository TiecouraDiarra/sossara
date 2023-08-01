import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyListingRoutingModule } from './my-listing-routing.module';
import { MyListingComponent } from './my-listing.component';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';


@NgModule({
  declarations: [
    MyListingComponent
  ],
  imports: [
    CommonModule,
    Ng2SearchPipeModule,
    MyListingRoutingModule,
    SharedModule
  ]
})
export class MyListingModule { }
