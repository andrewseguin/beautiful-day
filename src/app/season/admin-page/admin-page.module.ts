import {NgModule} from '@angular/core';
import {AdminPage} from './admin-page';
import {ExtrasModule} from './extras/extras.module';
import {ManageProjectsModule} from './manage-projects/manage-projects.module';
import {CommonModule} from '@angular/common';
import {MaterialModule} from 'app/material.module';
import {ManageGroupsModule} from './manage-groups/manage-groups.module';
import {EventsModule} from './events/events.module';
import {RouterModule, Routes} from '@angular/router';
import {ManageProjects} from 'app/season/admin-page/manage-projects/manage-projects';

const routes: Routes = [
  {path: '', component: AdminPage, children: [
      {path: 'projects', component: ManageProjects}
  ]}
];

@NgModule({imports: [RouterModule.forChild(routes)], exports: [RouterModule]})
export class AdminPageRoutingModule {}

@NgModule({
  imports: [
    CommonModule,
    ExtrasModule,
    MaterialModule,
    ManageProjectsModule,
    ManageGroupsModule,
    EventsModule,
    AdminPageRoutingModule,
  ],
  declarations: [AdminPage],
  exports: [AdminPage],
})
export class AdminPageModule { }
