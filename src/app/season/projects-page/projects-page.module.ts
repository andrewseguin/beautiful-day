import {NgModule} from '@angular/core';
import {ProjectsPage} from './projects-page';
import {CommonModule} from '@angular/common';
import {MaterialModule} from 'app/material.module';
import {DetailUserModule} from './user/detail-user.module';
import {LoadingModule} from '../shared/loading/loading.module';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [{path: '', component: ProjectsPage}];

@NgModule({imports: [RouterModule.forChild(routes)], exports: [RouterModule]})
export class ProjectsPageRoutingModule {}

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    DetailUserModule,
    LoadingModule,
    ProjectsPageRoutingModule
  ],
  declarations: [ProjectsPage],
  exports: [ProjectsPage],
})
export class ProjectsPageModule { }
