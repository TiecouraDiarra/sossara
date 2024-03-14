import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrangeMoneyComponent } from './orange-money.component';

const routes: Routes = [{ path: '', component: OrangeMoneyComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProprietaireRoutingModule { }
