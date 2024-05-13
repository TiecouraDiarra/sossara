import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailsConversationComponent } from './details-conversation.component';

const routes: Routes = [{ path: '', component: DetailsConversationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetailsConversationRoutingModule { }
