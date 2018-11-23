import {NgModule} from '@angular/core';
import {AdminPage} from './admin-page';
import {OwnerModule} from './owner/owner.module';
import {ProjectsModule} from './projects/projects.module';
import {CommonModule} from '@angular/common';
import {MaterialModule} from 'app/material.module';
import {GroupsModule} from './groups/groups.module';
import {EventsModule} from './events/events.module';
import {RouterModule, Routes} from '@angular/router';
import {RouteGuardModule} from 'app/season/shared/route-guard/route-guard.module';
import {MessagesModule} from './messages/messages.module';

const routes: Routes = [{path: '', component: AdminPage}];

@NgModule({imports: [RouterModule.forChild(routes)], exports: [RouterModule]})
export class AdminPageRoutingModule {}

@NgModule({
  imports: [
    CommonModule,
    OwnerModule,
    MaterialModule,
    MessagesModule,
    ProjectsModule,
    GroupsModule,
    EventsModule,
    AdminPageRoutingModule,
    RouteGuardModule,
  ],
  declarations: [AdminPage],
  exports: [AdminPage],
})
export class AdminPageModule { }
