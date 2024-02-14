import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailsbienComponent } from './detailsbien.component';

const routes: Routes = [{ path: '', component: DetailsbienComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetailsbienRoutingModule { }
