import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserpagesRoutingModule } from './userpages-routing.module';
import { UserpagesComponent } from './userpages.component';
// import { LocataireComponent } from './locataire/locataire.component';
// import { ProprietaireComponent } from './proprietaire/proprietaire.component';
// import { AgenceComponent } from './agence/agence.component';
import { FormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { GimComponent } from './gim/gim.component';
import { VisaComponent } from './visa/visa.component';
import { FactureComponent } from './facture/facture.component';
import { RecuComponent } from './recu/recu.component';
import { ListerecuComponent } from './listerecu/listerecu.component';
import { ContratComponent } from './contrat/contrat.component';
import { MessagesComponent } from './messages/messages.component';
import { ModifierBienComponent } from './modifier-bien/modifier-bien.component';
import { RdvComponent } from './rdv/rdv.component';
import { DetailsConversationComponent } from './details-conversation/details-conversation.component';
import { ListefactureComponent } from './listefacture/listefacture.component';
// import { MesReclamationsComponent } from './mes-reclamations/mes-reclamations.component';
// import { ProcessusLancesComponent } from './processus-lances/processus-lances.component';


@NgModule({
  declarations: [
    UserpagesComponent,
    GimComponent,
    VisaComponent,
    FactureComponent,
    RecuComponent,
    ListerecuComponent,
    ContratComponent,
    MessagesComponent,
    MessagesComponent,
    ContratComponent,
    RdvComponent,
    DetailsConversationComponent,
    ListefactureComponent,
    // LocataireComponent,
    // ProprietaireComponent,
    // MesReclamationsComponent,
    // ProcessusLancesComponent,
    // AgenceComponent,
    // LocataireComponent
  ],
  imports: [
    CommonModule,
    UserpagesRoutingModule,
    FormsModule,
    Ng2SearchPipeModule,
    SharedModule,
    NgxPaginationModule
  ]
})
export class UserpagesModule { }
