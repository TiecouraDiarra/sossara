import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { DetailsConversationRoutingModule } from './details-conversation-routing.module';



@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    DetailsConversationRoutingModule,
    FormsModule,
    Ng2SearchPipeModule
  ]
})
export class DetailsConversationModule { }
