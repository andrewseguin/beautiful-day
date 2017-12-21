import {NgModule} from '@angular/core';
import {MaterialModule} from 'app/material.module';
import {ProjectNavComponent} from './project-nav.component';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
  ],
  declarations: [ProjectNavComponent],
  exports: [ProjectNavComponent],
})
export class ProjectNavModule { }
