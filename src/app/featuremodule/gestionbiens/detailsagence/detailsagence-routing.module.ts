import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailsagenceComponent } from './detailsagence.component';

const routes: Routes = [{ path: '', component: DetailsagenceComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetailsagenceRoutingModule { }
