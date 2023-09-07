import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookmarksRoutingModule } from './bookmarks-routing.module';
import { BookmarksComponent } from './bookmarks.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    BookmarksComponent
  ],
  imports: [
    CommonModule,
    BookmarksRoutingModule,
    FormsModule
  ]
})
export class BookmarksModule { }
