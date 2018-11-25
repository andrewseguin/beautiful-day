import {NgModule} from '@angular/core';
import {ProjectsPage} from './projects-page';
import {CommonModule} from '@angular/common';
import {MaterialModule} from 'app/material.module';
import {LoadingModule} from 'app/season/shared/loading/loading.module';
import {RouterModule, Routes} from '@angular/router';
import {ProjectSummaryModule} from './project-summary/project-summary.module';

const routes: Routes = [{path: '', component: ProjectsPage}];

@NgModule({imports: [RouterModule.forChild(routes)], exports: [RouterModule]})
export class ProjectsPageRoutingModule {}

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    LoadingModule,
    ProjectSummaryModule,
    ProjectsPageRoutingModule
  ],
  declarations: [ProjectsPage],
  exports: [ProjectsPage],
})
export class ProjectsPageModule { }
