import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrouverbienComponent } from './trouverbien.component';

const routes: Routes = [{ path: '', component: TrouverbienComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListingmapGridRoutingModule { }
