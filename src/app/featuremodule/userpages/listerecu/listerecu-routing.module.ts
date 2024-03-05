import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { ListerecuComponent } from './listerecu.component';


const routes: Routes = [{ path: '', component: ListerecuComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListrecuRoutingModule { }
