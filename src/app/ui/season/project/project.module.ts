import {NgModule} from '@angular/core';
import {ProjectComponent} from './project.component';
import {MaterialModule} from 'app/material.module';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ProjectRequestsModule} from './requests/project-requests.module';
import {LoadingModule} from 'app/ui/season/shared/loading/loading.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    ProjectRequestsModule,
    LoadingModule,
  ],
  declarations: [ProjectComponent],
  exports: [ProjectComponent],
})
export class ProjectModule { }
