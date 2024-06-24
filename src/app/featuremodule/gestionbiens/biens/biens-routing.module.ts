import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BiensComponent } from './biens.component';

const routes: Routes = [{ path: '', component: BiensComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BiensRoutingModule { }
