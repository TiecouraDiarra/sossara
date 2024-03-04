import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GestionbiensComponent } from './gestionbiens.component';

const routes: Routes = [
  {
    path: '',
    component: GestionbiensComponent,
    children: [
      {
        path: 'bienparcommune',
        loadChildren: () =>
          import('./bienparcommune/bienparcommune.module').then(
            (m) => m.BienparcommuneModule
          ),
      },
      {
        path: 'biens',
        loadChildren: () =>
          import('./biens/biens.module').then(
            (m) => m.ListingGridSidebarModule
          ),
      },
      {
        path: 'detailsagence',
        loadChildren: () =>
          import('./detailsagence/detailsagence.module').then(
            (m) => m.DetailsagenceModule
          ),
      },
      {
        path: 'trouverbien',
        loadChildren: () =>
          import('./trouverbien/trouverbien.module').then(
            (m) => m.TrouverbienModule
          ),
      },
      {
        path: 'rechercher',
        loadChildren: () =>
          import('./recherchebien/recherchebien.module').then((m) => m.RecherchebienModule),
          // canActivate: [AuthGuard]
      },
      {
        path: 'details-agent',
        loadChildren: () =>
          import('./detailsagent/detailsagent.module').then(
            (m) => m.ListingmapListModule
          ),
      },

    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestionbiensRoutingModule { }
