import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from 'app/material.module';
import {ProjectListComponent} from './project-list.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
  ],
  declarations: [ProjectListComponent],
  exports: [ProjectListComponent],
})
export class ProjectListModule { }
