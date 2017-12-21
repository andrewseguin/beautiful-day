import {NgModule} from '@angular/core';
import {ProjectComponent} from './project.component';
import {ProjectDetailsModule} from './details/project-details.module';
import {MaterialModule} from 'app/material.module';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ProjectNotesModule} from './notes/project-notes.module';
import {ProjectRequestsModule} from './requests/project-requests.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    ProjectDetailsModule,
    ProjectNotesModule,
    ProjectRequestsModule,
  ],
  declarations: [ProjectComponent],
  exports: [ProjectComponent],
})
export class ProjectModule { }
