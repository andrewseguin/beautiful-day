import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MaterialModule} from 'app/material.module';
import {RouteGuardModule} from 'app/season/shared/route-guard/route-guard.module';
import {AdminPage} from './admin-page';
import {EventsModule} from './events/events.module';
import {FaqsModule} from './faqs/faqs.module';
import {GroupsModule} from './groups/groups.module';
import {MessagesModule} from './messages/messages.module';
import {OwnerModule} from './owner/owner.module';
import {ProjectsModule} from './projects/projects.module';
import {ContactsModule} from './contacts/contacts.module';

const routes: Routes = [{path: '', component: AdminPage}];

@NgModule({imports: [RouterModule.forChild(routes)], exports: [RouterModule]})
export class AdminPageRoutingModule {}

@NgModule({
  imports: [
    CommonModule,
    OwnerModule,
    MaterialModule,
    ContactsModule,
    MessagesModule,
    ProjectsModule,
    GroupsModule,
    EventsModule,
    FaqsModule,
    AdminPageRoutingModule,
    RouteGuardModule,
  ],
  declarations: [AdminPage],
  exports: [AdminPage],
})
export class AdminPageModule { }
