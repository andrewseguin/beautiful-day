import {NgModule} from '@angular/core';
import {Projects} from './projects';
import {CommonModule} from '@angular/common';
import {MaterialModule} from 'app/material.module';
import {EditableProjectModule} from './editable-project/editable-project.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    EditableProjectModule
  ],
  declarations: [Projects],
  exports: [Projects],
})
export class ProjectsModule { }
