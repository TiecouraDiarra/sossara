import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListingListSidebarRoutingModule } from './listing-list-sidebar-routing.module';
import { ListingListSidebarComponent } from './listing-list-sidebar.component';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ListingListSidebarComponent
  ],
  imports: [
    CommonModule,
    ListingListSidebarRoutingModule,
    SharedModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    FormsModule
  ]
})
export class ListingListSidebarModule { }
