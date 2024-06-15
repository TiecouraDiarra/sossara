import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { AuthGuard } from '../auth.guard';

const routes: Routes = [
  { path: '', component: AuthComponent },
  {
    path: 'mdp-oublie',
    loadChildren: () =>
      import('./forgot-password/forgot-password.module').then(
        (m) => m.ForgotPasswordModule 
      ), 
    canActivate: [AuthGuard]
  },
  {
    path: 'completer-profil',
    loadChildren: () =>
      import('./complete-profil/complete-profil.module').then(
        (m) => m.CompleteProfilModule
      ),
    canActivate: [AuthGuard]
  },
  {
    path: 'connexion',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'inscription',
    loadChildren: () =>
      import('./signup/signup.module').then((m) => m.SignupModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'reset-password/:token',
    loadChildren: () =>
      import('./reset-password/reset-password.module').then((m) => m.ResetPasswordModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'activate-account/:token',
    loadChildren: () =>
      import('./activateAcount/activate.module').then((m) => m.ActivateModule),
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
