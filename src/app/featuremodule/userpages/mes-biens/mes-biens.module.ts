import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MesBiensRoutingModule } from './mes-biens-routing.module';
import { MesBiensComponent } from './mes-biens.component';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    MesBiensComponent,
    // SegmentedControlComponent,
  ],
  imports: [
    CommonModule,
    Ng2SearchPipeModule,
    MesBiensRoutingModule,
    SharedModule,
    NgxPaginationModule
  ],
  providers: [
    DatePipe],
})
export class MesBiensModule { }
