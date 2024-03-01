import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RecuComponent } from './recu.component';


const routes: Routes = [{ path: '', component: RecuComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecuRoutingModule { }
