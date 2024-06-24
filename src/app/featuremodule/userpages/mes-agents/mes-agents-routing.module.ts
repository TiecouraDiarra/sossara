import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MesAgentsComponent } from './mes-agents.component';

const routes: Routes = [{ path: '', component: MesAgentsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MesAgentsRoutingModule { }
