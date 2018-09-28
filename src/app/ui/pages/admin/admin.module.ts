import {NgModule} from '@angular/core';
import {AdminComponent} from './admin.component';
import {ExtrasModule} from 'app/ui/pages/admin/extras/extras.module';
import {ManageProjectsModule} from 'app/ui/pages/admin/manage-projects/manage-projects.module';
import {CommonModule} from '@angular/common';
import {MaterialModule} from 'app/material.module';
import {ManageGroupsModule} from './manage-groups/manage-groups.module';

@NgModule({
  imports: [
    CommonModule,
    ExtrasModule,
    MaterialModule,
    ManageProjectsModule,
    ManageGroupsModule,
  ],
  declarations: [AdminComponent],
  exports: [AdminComponent],
})
export class AdminModule { }
