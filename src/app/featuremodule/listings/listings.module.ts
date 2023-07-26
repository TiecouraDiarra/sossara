import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListingsRoutingModule } from './listings-routing.module';
import { ListingsComponent } from './listings.component';
import { SharedModule } from 'src/app/shared/shared/shared.module';
// import { Ng2SearchPipeModule } from 'ng2-search-filter';

@NgModule({
  declarations: [ListingsComponent],
  imports: [
    CommonModule, 
    ListingsRoutingModule, 
    SharedModule,
    // Ng2SearchPipeModule,

  ],
})
export class ListingsModule {}
