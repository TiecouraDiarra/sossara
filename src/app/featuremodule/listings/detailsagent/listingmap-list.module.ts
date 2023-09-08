import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListingmapListRoutingModule } from './listingmap-list-routing.module';
import { ListingmapListComponent } from './listingmap-list.component';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

@NgModule({
  declarations: [ListingmapListComponent],
  imports: [CommonModule, ListingmapListRoutingModule, SharedModule, Ng2SearchPipeModule,
    NgxPaginationModule],
})
export class ListingmapListModule {}
