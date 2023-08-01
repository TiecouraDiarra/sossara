import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeaturemoduleComponent } from './featuremodule.component';

const routes: Routes = [
  {
    path: '',
    component: FeaturemoduleComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'accueil',
      },
      {
        path: '',
        loadChildren: () =>
          import('./home/home.module').then((m) => m.HomeModule),
      },
      {
        path: 'auth',
        loadChildren: () =>
          import('../auth/auth.module').then((m) => m.AuthModule),
      },
      {
        path: 'listings',
        loadChildren: () =>
          import('./listings/listings.module').then((m) => m.ListingsModule),
      },
      {
        path: 'pages',
        loadChildren: () =>
          import('./pages/pages.module').then((m) => m.PagesModule),
      },
      {
        path: 'userpages',
        loadChildren: () =>
          import('./userpages/userpages.module').then((m) => m.UserpagesModule),
      },
      {
        path: 'trouverbien',
        loadChildren: () =>
          import('./listings/listingmap-grid/listingmap-grid.module').then(
            (m) => m.ListingmapGridModule
          ),
      },
      {
        path: 'biens',
        loadChildren: () =>
          import('./listings/listing-grid-sidebar/listing-grid-sidebar.module').then(
            (m) => m.ListingGridSidebarModule
          ),
      },
      {
        path: 'bienparcommune/:id',
        loadChildren: () =>
          import('./listings/listing-grid/listing-grid.module').then(
            (m) => m.ListingGridModule
          ),
      },
      {
        path: 'blog',
        loadChildren: () =>
          import('./blog/blog-grid-sidebar/blog-grid-sidebar.module').then(
            (m) => m.BlogGridSidebarModule
          ),
      },
      // {
      //   path: 'commune',
      //   loadChildren: () =>
      //     import('./listings/listing-grid/listing-grid.module').then(
      //       (m) => m.ListingGridModule
      //     ),
      // },
      {
        path: 'blog',
        loadChildren: () =>
          import('./blog/blog.module').then((m) => m.BlogModule),
      },
      {
        path: 'contact',
        loadChildren: () =>
          import('./contact/contact.module').then((m) => m.ContactModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeaturemoduleRoutingModule {}
