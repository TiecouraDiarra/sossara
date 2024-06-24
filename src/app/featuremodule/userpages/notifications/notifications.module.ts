import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { NotificationsRoutingModule } from './notifications-routing.module';
import { NotificationsComponent } from './notifications.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    NotificationsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NotificationsRoutingModule
  ],
  providers: [
    DatePipe],
})
export class NotificationsModule { }
