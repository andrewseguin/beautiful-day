import {NgModule} from '@angular/core';
import {ManageProjectsComponent} from 'app/ui/pages/admin/manage-projects/manage-projects.component';
import {CommonModule} from '@angular/common';
import {MaterialModule} from 'app/material.module';
import {EditableProjectModule} from 'app/ui/pages/admin/manage-projects/editable-project/editable-project.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    EditableProjectModule
  ],
  declarations: [ManageProjectsComponent],
  exports: [ManageProjectsComponent],
})
export class ManageProjectsModule { }
