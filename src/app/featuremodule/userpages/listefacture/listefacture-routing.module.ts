import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListefactureComponent } from './listefacture.component';





const routes: Routes = [{ path: '', component: ListefactureComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListfactureRoutingModule { }
