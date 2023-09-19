import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';

const routes: Routes = [
  { path: '', component: AuthComponent },
  {
    path: 'mdp-oublie',
    loadChildren: () =>
      import('./forgot-password/forgot-password.module').then(
        (m) => m.ForgotPasswordModule
      ),
  },
  {
    path: 'connexion',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'inscription',
    loadChildren: () =>
      import('./signup/signup.module').then((m) => m.SignupModule),
  },
  {
    path: 'reset-password/:token',
    loadChildren: () =>
      import('./reset-password/reset-password.module').then((m) => m.ResetPasswordModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
