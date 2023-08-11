import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/auth.guard';
import { UserpagesComponent } from './userpages.component';

const routes: Routes = [
  {
    path: '', component: UserpagesComponent, children: [
      {
        path: 'ajouter-propriete',
        loadChildren: () =>
          import('./add-listing/add-listing.module').then(
            (m) => m.AddListingModule
          ),
          // canActivate: [AuthGuard]
      },
      {
        path: 'bookmarks',
        loadChildren: () =>
          import('./bookmarks/bookmarks.module').then((m) => m.BookmarksModule),
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
        path: 'mes-proprietes',
        loadChildren: () =>
          import('./my-listing/my-listing.module').then((m) => m.MyListingModule),
          // canActivate: [AuthGuard]
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./profile/profile.module').then((m) => m.ProfileModule),
          // canActivate: [AuthGuard]
      },
      {
        path: 'commentaire',
        loadChildren: () =>
          import('./reviews/reviews.module').then((m) => m.ReviewsModule),
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
