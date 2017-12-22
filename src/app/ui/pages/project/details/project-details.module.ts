import {NgModule} from '@angular/core';
import {ProjectDetailsComponent} from './project-details.component';
import {DetailUserModule} from './user/detail-user.module';
import {CommonModule} from '@angular/common';
import {MaterialModule} from 'app/material.module';
import {PipeModule} from 'app/pipe/pipe.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    PipeModule,
    DetailUserModule,
  ],
  declarations: [ProjectDetailsComponent],
  exports: [ProjectDetailsComponent],
})
export class ProjectDetailsModule { }
