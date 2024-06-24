import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogGridSidebarRoutingModule } from './blog-grid-sidebar-routing.module';
import { BlogGridSidebarComponent } from './blog-grid-sidebar.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    BlogGridSidebarComponent
  ],
  imports: [
    CommonModule,
    BlogGridSidebarRoutingModule,
    FormsModule,
    Ng2SearchPipeModule
  ]
})
export class BlogGridSidebarModule { }
