import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DetailsagenceRoutingModule } from './detailsagence-routing.module';
import { DetailsagenceComponent } from './detailsagence.component';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    DetailsagenceComponent
  ],
  imports: [
    CommonModule,
    DetailsagenceRoutingModule,
    SharedModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    FormsModule
  ]
})
export class DetailsagenceModule { }
