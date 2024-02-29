import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GimComponent } from './gim.component';

const routes: Routes = [{ path: '', component: GimComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GimRoutingModule { }
