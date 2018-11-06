import {NgModule} from '@angular/core';
import {ProjectPage} from './project-page';
import {MaterialModule} from 'app/material.module';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {ProjectRequestsModule} from './requests/project-requests.module';
import {LoadingModule} from 'app/season/shared/loading/loading.module';

const routes: Routes = [{path: '', component: ProjectPage}];

@NgModule({imports: [RouterModule.forChild(routes)], exports: [RouterModule]})
export class ProjectPageRoutingModule {}

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    ProjectRequestsModule,
    LoadingModule,
    ProjectPageRoutingModule
  ],
  declarations: [ProjectPage],
  exports: [ProjectPage],
})
export class ProjectPageModule { }
