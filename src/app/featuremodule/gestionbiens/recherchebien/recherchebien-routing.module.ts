import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecherchebienComponent } from './recherchebien.component';

const routes: Routes = [{ path: '', component: RecherchebienComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecherchebienRoutingModule { }
