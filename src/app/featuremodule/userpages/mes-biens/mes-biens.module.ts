import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MesBiensRoutingModule } from './mes-biens-routing.module';
import { MesBiensComponent } from './mes-biens.component';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { DatePipe } from '@angular/common';
import { LocataireComponent } from '../locataire/locataire.component';
import { AgenceComponent } from '../agence/agence.component';
import { ProcessusLancesComponent } from '../processus-lances/processus-lances.component';
import { MesReclamationsComponent } from '../mes-reclamations/mes-reclamations.component';
import { CandidaturesComponent } from '../candidatures/candidatures.component';
import { CandidaturesAccepterComponent } from '../candidatures-accepter/candidatures-accepter.component';
import { CandidaturesAnnulerComponent } from '../candidatures-annuler/candidatures-annuler.component';

@NgModule({
  declarations: [
    MesBiensComponent,
    LocataireComponent,
    // SegmentedControlComponent,
    CandidaturesComponent,
    CandidaturesAccepterComponent,
    CandidaturesAnnulerComponent,
    AgenceComponent,
    ProcessusLancesComponent,
    MesReclamationsComponent
    
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
