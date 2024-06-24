import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModifierBienComponent } from './modifier-bien.component';

const routes: Routes = [{ path: '', component: ModifierBienComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModifierBienRoutingModule { }
