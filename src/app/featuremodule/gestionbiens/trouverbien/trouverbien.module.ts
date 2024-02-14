import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListingmapGridRoutingModule } from './trouverbien-routing.module';
import { TrouverbienComponent } from './trouverbien.component';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { FilterMarkersPipe } from './filter-markers.pipe';

@NgModule({
  declarations: [TrouverbienComponent, FilterMarkersPipe ],
  imports: [
    CommonModule, 
    ListingmapGridRoutingModule, 
    SharedModule,
    Ng2SearchPipeModule,
    NgxPaginationModule
  ],
})
export class TrouverbienModule {}
