import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'accueil',
      },
      {
        path: 'accueil',
        loadChildren: () =>
          import('./home-nine/home-nine.module').then((m) => m.HomeNineModule),
      },
      {
        path: 'accueil',
        loadChildren: () =>
          import('./home-nine/home-nine.module').then((m) => m.HomeNineModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
