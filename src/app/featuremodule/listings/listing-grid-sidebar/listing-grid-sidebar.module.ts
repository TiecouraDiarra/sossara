import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListingGridSidebarRoutingModule } from './listing-grid-sidebar-routing.module';
import { ListingGridSidebarComponent } from './listing-grid-sidebar.component';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';



@NgModule({
  declarations: [
    ListingGridSidebarComponent
  ],
  imports: [
    CommonModule,
    ListingGridSidebarRoutingModule,
    SharedModule,
    Ng2SearchPipeModule,
    NgxPaginationModule
    

  ]
})
export class ListingGridSidebarModule { }
