import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListingmapGridRoutingModule } from './listingmap-grid-routing.module';
import { ListingmapGridComponent } from './listingmap-grid.component';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [ListingmapGridComponent],
  imports: [
    CommonModule, 
    ListingmapGridRoutingModule, 
    SharedModule,
    Ng2SearchPipeModule,
    NgxPaginationModule
  ],
})
export class ListingmapGridModule {}
