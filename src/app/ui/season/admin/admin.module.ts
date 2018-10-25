import {NgModule} from '@angular/core';
import {AdminComponent} from './admin.component';
import {ExtrasModule} from 'app/ui/season/admin/extras/extras.module';
import {ManageProjectsModule} from 'app/ui/season/admin/manage-projects/manage-projects.module';
import {CommonModule} from '@angular/common';
import {MaterialModule} from 'app/material.module';
import {ManageGroupsModule} from './manage-groups/manage-groups.module';
import {EventsModule} from 'app/ui/season/admin/events/events.module';

@NgModule({
  imports: [
    CommonModule,
    ExtrasModule,
    MaterialModule,
    ManageProjectsModule,
    ManageGroupsModule,
    EventsModule,
  ],
  declarations: [AdminComponent],
  exports: [AdminComponent],
})
export class AdminModule { }
