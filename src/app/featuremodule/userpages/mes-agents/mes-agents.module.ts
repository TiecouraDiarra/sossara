import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MesAgentsRoutingModule } from './mes-agents-routing.module';
import { MesAgentsComponent } from './mes-agents.component';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';


@NgModule({
  declarations: [
    MesAgentsComponent
  ],
  imports: [
    CommonModule,
    MesAgentsRoutingModule,
    FormsModule,
    Ng2SearchPipeModule,
    NgxPaginationModule
  ]
})
export class MesAgentsModule { }
