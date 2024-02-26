import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeaturemoduleRoutingModule } from './featuremodule-routing.module';
import { FeaturemoduleComponent } from './featuremodule.component';
import { SharedModule } from '../shared/shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { RecherchebienComponent } from './recherchebien/recherchebien.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { FilterMarkersPipe } from './recherchebien/filter-markers.pipe';

@NgModule({
  declarations: [FeaturemoduleComponent, RecherchebienComponent, FilterMarkersPipe,],
  imports: [
    CommonModule, 
    FeaturemoduleRoutingModule, 
    SharedModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    HttpClientModule
  ],
})
export class FeaturemoduleModule {}
