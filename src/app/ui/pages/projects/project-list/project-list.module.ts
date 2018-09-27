import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from 'app/material.module';
import {ProjectListComponent} from './project-list.component';
import {DetailUserModule} from '../../shared/user/detail-user.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    DetailUserModule,
  ],
  declarations: [ProjectListComponent],
  exports: [ProjectListComponent],
})
export class ProjectListModule { }
