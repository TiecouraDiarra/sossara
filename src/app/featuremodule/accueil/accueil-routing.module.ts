import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './accueil.component';

const routes: Routes = [
  {
    path: '',
    component: AccueilComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'accueil',
      },
      {
        path: 'accueil',
        loadChildren: () =>
          import('./accueil/accueil.module').then((m) => m.HomeNineModule),
      },
      {
        path: 'accueil',
        loadChildren: () =>
          import('./accueil/accueil.module').then((m) => m.HomeNineModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
