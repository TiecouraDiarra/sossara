import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListingGridRoutingModule } from './listing-grid-routing.module';
import { ListingGridComponent } from './listing-grid.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { SharedModule } from 'src/app/shared/shared/shared.module';


@NgModule({
  declarations: [
    ListingGridComponent
  ],
  imports: [
    CommonModule,
    ListingGridRoutingModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    SharedModule,
    FormsModule
  ]
})
export class ListingGridModule { }
