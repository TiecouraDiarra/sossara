import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BienparcommuneComponent } from './bienparcommune.component';

const routes: Routes = [{ path: '', component: BienparcommuneComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BienparcommuneRoutingModule { }
