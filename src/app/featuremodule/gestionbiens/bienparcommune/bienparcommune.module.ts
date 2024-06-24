import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BienparcommuneRoutingModule } from './bienparcommune-routing.module';
import { BienparcommuneComponent } from './bienparcommune.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { SharedModule } from 'src/app/shared/shared/shared.module';


@NgModule({
  declarations: [
    BienparcommuneComponent
  ],
  imports: [
    CommonModule,
    BienparcommuneRoutingModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    SharedModule,
    FormsModule
  ]
})
export class BienparcommuneModule { }
