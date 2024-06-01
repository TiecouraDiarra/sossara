import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MesAgentsRoutingModule } from './mes-agents-routing.module';
import { MesAgentsComponent } from './mes-agents.component';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { SharedModule } from 'src/app/shared/shared/shared.module';


@NgModule({
  declarations: [
    MesAgentsComponent
  ],
  imports: [
    CommonModule,
    MesAgentsRoutingModule,
    FormsModule,
    Ng2SearchPipeModule,
    SharedModule,
    NgxPaginationModule
  ]
})
export class MesAgentsModule { }
