import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth.guard';
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
          // canActivate: [AuthGuard]
      },
      {
        path: 'listings',
        loadChildren: () =>
          import('./listings/listings.module').then((m) => m.ListingsModule),
          canActivate: [AuthGuard]
      },
      {
        path: 'pages',
        loadChildren: () =>
          import('./pages/pages.module').then((m) => m.PagesModule),
          // canActivate: [AuthGuard]
      },
      {
        path: 'userpages',
        loadChildren: () =>
          import('./userpages/userpages.module').then((m) => m.UserpagesModule),
          // canActivate: [AuthGuard]
      },
      {
        path: 'trouverbien',
        loadChildren: () =>
          import('./listings/listingmap-grid/listingmap-grid.module').then(
            (m) => m.ListingmapGridModule
          ),
          // canActivate: [AuthGuard]
      },
      {
        path: 'biens',
        loadChildren: () =>
          import('./listings/listing-grid-sidebar/listing-grid-sidebar.module').then(
            (m) => m.ListingGridSidebarModule
          ),
          // canActivate: [AuthGuard]
      },
      {
        path: 'bienparcommune/:id',
        loadChildren: () =>
          import('./listings/listing-grid/listing-grid.module').then(
            (m) => m.ListingGridModule
          ),
          // canActivate: [AuthGuard]
      },
      {
        path: 'blog',
        loadChildren: () =>
          import('./blog/blog-grid-sidebar/blog-grid-sidebar.module').then(
            (m) => m.BlogGridSidebarModule
          ),
          // canActivate: [AuthGuard]
      },
      {
        path: 'blog-details/:id',
        loadChildren: () =>
          import('./blog/blog-details/blog-details.module').then(
            (m) => m.BlogDetailsModule
          ),
      },
      // {
      //   path: 'blog-details',
      //   loadChildren: () =>
      //     import('./blog/blog-details/blog-details-routing.module').then(
      //       (m) => m.BlogDetailsRoutingModule
      //     ),
      // },
      // {
      //   path: 'commune',
      //   loadChildren: () =>
      //     import('./listings/listing-grid/listing-grid.module').then(
      //       (m) => m.ListingGridModule
      //     ),
      // },
      // {
      //   path: 'blog',
      //   loadChildren: () =>
      //     import('./blog/blog.module').then((m) => m.BlogModule),
      //     canActivate: [AuthGuard]
      // },
      {
        path: 'contact',
        loadChildren: () =>
          import('./contact/contact.module').then((m) => m.ContactModule),
          // canActivate: [AuthGuard]
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeaturemoduleRoutingModule {}
