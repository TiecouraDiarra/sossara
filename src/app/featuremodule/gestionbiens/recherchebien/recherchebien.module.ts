import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared/shared.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { RecherchebienComponent } from './recherchebien.component';
import { RecherchebienRoutingModule } from './recherchebien-routing.module';
import { FilterMarkersPipes } from './filter-markers.pipe';


@NgModule({
  declarations: [RecherchebienComponent, FilterMarkersPipes ],
  imports: [
    CommonModule, 
    RecherchebienRoutingModule, 
    SharedModule,
    Ng2SearchPipeModule,
    NgxPaginationModule
  ],
})
export class RecherchebienModule {}
