import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';


const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./featuremodule/featuremodule.module').then(
        (m) => m.FeaturemoduleModule
      ),
      // canActivate: [AuthGuard]
  },

  {
    path: 'error',
    loadChildren: () =>
      import('./error/error.module').then((m) => m.ErrorModule),
      // canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: '/error/error404',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
