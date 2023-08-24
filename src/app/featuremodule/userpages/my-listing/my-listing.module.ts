import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyListingRoutingModule } from './my-listing-routing.module';
import { MyListingComponent } from './my-listing.component';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { DatePipe } from '@angular/common';
import { SegmentedControlComponent } from 'src/app/segmented-control/segmented-control.component';


@NgModule({
  declarations: [
    MyListingComponent,
    // SegmentedControlComponent,
  ],
  imports: [
    CommonModule,
    Ng2SearchPipeModule,
    MyListingRoutingModule,
    SharedModule,
    NgxPaginationModule
  ],
  providers: [
    DatePipe],
})
export class MyListingModule { }
