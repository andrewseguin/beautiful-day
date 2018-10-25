import {NgModule} from '@angular/core';
import {ProjectsComponent} from './projects.component';
import {CommonModule} from '@angular/common';
import {MaterialModule} from 'app/material.module';
import {DetailUserModule} from '../shared/user/detail-user.module';
import {LoadingModule} from '../shared/loading/loading.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    DetailUserModule,
    LoadingModule,
  ],
  declarations: [ProjectsComponent],
  exports: [ProjectsComponent],
})
export class ProjectsModule { }
