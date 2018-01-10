import {NgModule} from '@angular/core';
import {HomeComponent} from './home.component';
import {CommonModule} from '@angular/common';
import {MaterialModule} from 'app/material.module';
import {ProjectListModule} from './project-list/project-list.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    ProjectListModule,
  ],
  declarations: [HomeComponent],
  exports: [HomeComponent],
})
export class HomeModule { }
