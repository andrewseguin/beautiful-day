import {NgModule} from '@angular/core';
import {AdminPage} from './admin-page';
import {ExtrasModule} from './extras/extras.module';
import {ManageProjectsModule} from './manage-projects/manage-projects.module';
import {CommonModule} from '@angular/common';
import {MaterialModule} from 'app/material.module';
import {ManageGroupsModule} from './manage-groups/manage-groups.module';
import {EventsModule} from './events/events.module';
import {RouterModule, Routes} from '@angular/router';
import {RouteGuardModule} from 'app/season/shared/route-guard/route-guard.module';

const routes: Routes = [{path: '', component: AdminPage}];

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
    RouteGuardModule,
  ],
  declarations: [AdminPage],
  exports: [AdminPage],
})
export class AdminPageModule { }
