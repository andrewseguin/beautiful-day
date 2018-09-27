import {NgModule} from '@angular/core';
import {ProjectsComponent} from './projects.component';
import {CommonModule} from '@angular/common';
import {MaterialModule} from 'app/material.module';
import {ProjectListModule} from './project-list/project-list.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    ProjectListModule,
  ],
  declarations: [ProjectsComponent],
  exports: [ProjectsComponent],
})
export class ProjectsModule { }
