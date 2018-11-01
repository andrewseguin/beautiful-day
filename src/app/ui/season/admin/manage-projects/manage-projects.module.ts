import {NgModule} from '@angular/core';
import {ManageProjects} from 'app/ui/season/admin/manage-projects/manage-projects';
import {CommonModule} from '@angular/common';
import {MaterialModule} from 'app/material.module';
import {EditableProjectModule} from 'app/ui/season/admin/manage-projects/editable-project/editable-project.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    EditableProjectModule
  ],
  declarations: [ManageProjects],
  exports: [ManageProjects],
})
export class ManageProjectsModule { }
