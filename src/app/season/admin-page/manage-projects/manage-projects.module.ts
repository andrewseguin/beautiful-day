import {NgModule} from '@angular/core';
import {ManageProjects} from './manage-projects';
import {CommonModule} from '@angular/common';
import {MaterialModule} from 'app/material.module';
import {EditableProjectModule} from './editable-project/editable-project.module';

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
