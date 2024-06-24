import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompleteProfilComponent } from './complete-profil.component';

const routes: Routes = [{ path: '', component: CompleteProfilComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompleteProfilRoutingModule { }
