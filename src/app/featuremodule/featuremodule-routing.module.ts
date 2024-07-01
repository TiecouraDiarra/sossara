import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth.guard';
import { FeaturemoduleComponent } from './featuremodule.component';
import { LesagencesComponent } from './gestionbiens/lesagences/lesagences.component';

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
          import('./accueil/accueil.module').then((m) => m.AccueilModule),
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
          import('./gestionbiens/gestionbiens.module').then((m) => m.GestionbiensModule),
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
          canActivate: [AuthGuard]
      },
      {
        path: 'trouverbien',
        loadChildren: () =>
          import('./gestionbiens/trouverbien/trouverbien.module').then(
            (m) => m.TrouverbienModule
          ),
          // canActivate: [AuthGuard]
      },
      // {
      //   path: 'agences',
      //   loadChildren: () =>
      //     import('./gestionbiens/trouverbien/trouverbien.module').then(
      //       (m) => m.TrouverbienModule
      //     ),
      //     // canActivate: [AuthGuard]
      // },
          {path: 'agences', component: LesagencesComponent},

      
      {
        path: 'rechercher',
        loadChildren: () =>
          import('./gestionbiens/recherchebien/recherchebien.module').then((m) => m.RecherchebienModule),
          // canActivate: [AuthGuard]
      },
      {
        path: 'detailsagence/:nom',
        loadChildren: () =>
          import('./gestionbiens/detailsagence/detailsagence.module').then(
            (m) => m.DetailsagenceModule
          ),
      },
      {
        path: 'details-bien/:id',
        loadChildren: () =>
          import('./pages/detailsbien/detailsbien.module').then(
            (m) => m.DetailsbienModule
          ),
      },
      {
        path: 'details-agent/:id',
        loadChildren: () =>
          import('./gestionbiens/detailsagent/detailsagent.module').then(
            (m) => m.ListingmapListModule
          ),
      },
      {
        path: 'biens',
        loadChildren: () =>
          import('./gestionbiens/biens/biens.module').then(
            (m) => m.ListingGridSidebarModule
          ),
          // canActivate: [AuthGuard]
      },
      {
        path: 'bienparcommune/:nomcommune',
        loadChildren: () =>
          import('./gestionbiens/bienparcommune/bienparcommune.module').then(
            (m) => m.BienparcommuneModule
          ),
          // canActivate: [AuthGuard]
      },
      {
        path: 'blog',
        loadChildren: () =>
          import('./blog/blog/blog-grid-sidebar.module').then(
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
      {
        path: 'apropos',
        loadChildren: () =>
          import('./pages/apropos/apropos.module').then((m) => m.AproposModule),
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
