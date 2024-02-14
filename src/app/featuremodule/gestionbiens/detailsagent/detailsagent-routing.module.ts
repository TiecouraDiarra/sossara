import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailsagentComponent } from './detailsagent.component';

const routes: Routes = [{ path: '', component: DetailsagentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetailsagentRoutingModule { }
