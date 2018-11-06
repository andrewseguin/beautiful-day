import {NgModule} from '@angular/core';
import {ProjectsPage} from './projects-page';
import {CommonModule} from '@angular/common';
import {MaterialModule} from 'app/material.module';
import {DetailUserModule} from './user/detail-user.module';
import {LoadingModule} from '../shared/loading/loading.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    DetailUserModule,
    LoadingModule,
  ],
  declarations: [ProjectsPage],
  exports: [ProjectsPage],
})
export class ProjectsPageModule { }
