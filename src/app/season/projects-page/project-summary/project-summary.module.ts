import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from 'app/material.module';
import {ProjectSummary} from './project-summary';
import {DetailUserModule} from 'app/season/projects-page/user/detail-user.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    DetailUserModule,
  ],
  declarations: [ProjectSummary],
  exports: [ProjectSummary],
})
export class ProjectSummaryModule { }
