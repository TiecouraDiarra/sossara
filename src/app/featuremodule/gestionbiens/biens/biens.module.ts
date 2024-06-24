import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BiensRoutingModule } from './biens-routing.module';
import { BiensComponent } from './biens.component';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
// import { MonthNamePipe } from './month-name.pipe';



@NgModule({
  declarations: [
    BiensComponent,
    // MonthNamePipe
  ],
  imports: [
    CommonModule,
    BiensRoutingModule,
    SharedModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    FormsModule
  ]
})
export class ListingGridSidebarModule { }
