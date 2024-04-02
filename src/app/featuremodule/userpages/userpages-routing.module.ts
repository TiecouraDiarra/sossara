import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/auth.guard';
import { UserpagesComponent } from './userpages.component';

const routes: Routes = [
  {
    path: '', component: UserpagesComponent, children: [
      {
        path: 'ajouter-bien',
        loadChildren: () =>
          import('./ajouter-bien/ajouter-bien.module').then(
            (m) => m.AjouterBienModule
          ),
        // canActivate: [AuthGuard]
      },
      {
        path: 'modifier-bien/:uuid',
        loadChildren: () =>
          import('./modifier-bien/modifier-bien.module').then(
            (m) => m.ModifierBienModule
          ),
        // canActivate: [AuthGuard]
      },
      
      {
        path: 'mes-agents',
        loadChildren: () =>
          import('./mes-agents/mes-agents.module').then((m) => m.MesAgentsModule),
        // canActivate: [AuthGuard]
      },
      {
        path: 'mes-rdv',
        loadChildren: () =>
          import('./rdv/rdv.module').then((m) => m.RdvModule),
        // canActivate: [AuthGuard]
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
        // canActivate: [AuthGuard]
      },
      {
        path: 'messages',
        loadChildren: () =>
          import('./messages/messages.module').then((m) => m.MessagesModule),
        // canActivate: [AuthGuard]
      },
      {
        path: 'mes-biens',
        loadChildren: () =>
          import('./mes-biens/mes-biens.module').then((m) => m.MesBiensModule),
        // canActivate: [AuthGuard]
      },
      {
        path: 'profil',
        loadChildren: () =>
          import('./profile/profile.module').then((m) => m.ProfileModule),
        // canActivate: [AuthGuard]
      },
      {
        path: 'notification',
        loadChildren: () =>
          import('./notifications/notifications.module').then((m) => m.NotificationsModule),
        // canActivate: [AuthGuard]
      },
      {
        path: 'paiement-orangemoney/:uuid',
        loadChildren: () =>
          import('./orange-money/orange-money.module').then((m) => m.OrangeMoneyModule),
        // canActivate: [AuthGuard]
      },
      {
        path: 'paiement-gim/:uuid',
        loadChildren: () =>
          import('./gim/gim-routing.module').then((m) => m.GimRoutingModule),
        // canActivate: [AuthGuard]
      },
      {
        path: 'paiement-visa/:uuid',
        loadChildren: () =>
          import('./visa/visa-routing.module').then((m) => m.VisaRoutingModule),
        // canActivate: [AuthGuard]
      },
      {
        path: 'facturepaiement/:uuid',
        loadChildren: () =>
          import('./facture/facture-routing.module').then((m) => m.FactureRoutingModule),
        // canActivate: [AuthGuard]
      },

      {
        path: 'recufacture/:uuid',
        loadChildren: () =>
          import('./recu/recu-routing.module').then((m) => m.RecuRoutingModule),
        // canActivate: [AuthGuard]
      },
      {
        path: 'liste_recu/:uuid',
        loadChildren: () =>
          import('./listerecu/listerecu-routing.module').then((m) => m.ListrecuRoutingModule),
        // canActivate: [AuthGuard]
      },
      {
        path: 'contrat/:uuid',
        loadChildren: () =>
          import('./contrat/contrat-routing.module').then((m) => m.ContratRoutingModule),
        // canActivate: [AuthGuard]
      },

    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserpagesRoutingModule { }
