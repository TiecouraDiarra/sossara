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
          import('./ajouter-bien/add-listing.module').then(
            (m) => m.AddListingModule
          ),
          // canActivate: [AuthGuard]
      },
      {
        path: 'mes-agents',
        loadChildren: () =>
          import('./mes-agents/bookmarks.module').then((m) => m.BookmarksModule),
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
          import('./mes-biens/my-listing.module').then((m) => m.MyListingModule),
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
          import('./notifications/reviews.module').then((m) => m.ReviewsModule),
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
