import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestionbiensRoutingModule } from './gestionbiens-routing.module';
import { GestionbiensComponent } from './gestionbiens.component';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { LesagencesComponent } from './lesagences/lesagences.component';

@NgModule({
  declarations: [GestionbiensComponent],
  imports: [
    CommonModule, 
    GestionbiensRoutingModule, 
    SharedModule,
    Ng2SearchPipeModule,

  ],
})
export class GestionbiensModule {}
