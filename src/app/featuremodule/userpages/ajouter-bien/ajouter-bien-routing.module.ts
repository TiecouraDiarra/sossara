import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AjouterBienComponent } from './ajouter-bien.component';

const routes: Routes = [{ path: '', component: AjouterBienComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AjouterBienRoutingModule { }
