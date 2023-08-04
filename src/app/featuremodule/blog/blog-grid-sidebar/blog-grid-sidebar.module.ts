import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogGridSidebarRoutingModule } from './blog-grid-sidebar-routing.module';
import { BlogGridSidebarComponent } from './blog-grid-sidebar.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';


@NgModule({
  declarations: [
    BlogGridSidebarComponent
  ],
  imports: [
    CommonModule,
    BlogGridSidebarRoutingModule,
    Ng2SearchPipeModule
  ]
})
export class BlogGridSidebarModule { }
