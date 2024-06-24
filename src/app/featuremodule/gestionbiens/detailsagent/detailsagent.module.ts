import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DetailsagentRoutingModule } from './detailsagent-routing.module';
import { DetailsagentComponent } from './detailsagent.component';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

@NgModule({
  declarations: [DetailsagentComponent],
  imports: [CommonModule, DetailsagentRoutingModule, SharedModule, Ng2SearchPipeModule,
    NgxPaginationModule],
})
export class ListingmapListModule {}
