import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VisaComponent } from './visa.component';

const routes: Routes = [{ path: '', component: VisaComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VisaRoutingModule { }
