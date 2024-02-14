import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { NotificationsRoutingModule } from './notifications-routing.module';
import { NotificationsComponent } from './notifications.component';


@NgModule({
  declarations: [
    NotificationsComponent
  ],
  imports: [
    CommonModule,
    NotificationsRoutingModule
  ],
  providers: [
    DatePipe],
})
export class NotificationsModule { }
