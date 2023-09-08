import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListingsComponent } from './listings.component';

const routes: Routes = [
  {
    path: '',
    component: ListingsComponent,
    children: [
      {
        path: 'bienparcommune',
        loadChildren: () =>
          import('./bienparcommune/listing-grid.module').then(
            (m) => m.ListingGridModule
          ),
      },
      {
        path: 'biens',
        loadChildren: () =>
          import('./biens/listing-grid-sidebar.module').then(
            (m) => m.ListingGridSidebarModule
          ),
      },
      {
        path: 'detailsagence',
        loadChildren: () =>
          import('./detailsagence/listing-list-sidebar.module').then(
            (m) => m.ListingListSidebarModule
          ),
      },
      {
        path: 'trouverbien',
        loadChildren: () =>
          import('./trouverbien/listingmap-grid.module').then(
            (m) => m.ListingmapGridModule
          ),
      },
      {
        path: 'details-agent',
        loadChildren: () =>
          import('./detailsagent/listingmap-list.module').then(
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
export class ListingsRoutingModule { }
