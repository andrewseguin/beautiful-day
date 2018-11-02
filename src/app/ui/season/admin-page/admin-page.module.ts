import {NgModule} from '@angular/core';
import {AdminPage} from './admin-page';
import {ExtrasModule} from 'app/ui/season/admin-page/extras/extras.module';
import {ManageProjectsModule} from 'app/ui/season/admin-page/manage-projects/manage-projects.module';
import {CommonModule} from '@angular/common';
import {MaterialModule} from 'app/material.module';
import {ManageGroupsModule} from './manage-groups/manage-groups.module';
import {EventsModule} from 'app/ui/season/admin-page/events/events.module';

@NgModule({
  imports: [
    CommonModule,
    ExtrasModule,
    MaterialModule,
    ManageProjectsModule,
    ManageGroupsModule,
    EventsModule,
  ],
  declarations: [AdminPage],
  exports: [AdminPage],
})
export class AdminPageModule { }
