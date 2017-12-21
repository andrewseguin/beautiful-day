import {NgModule} from '@angular/core';
import {ProjectNotesComponent} from './project-notes.component';
import {CommonModule} from '@angular/common';
import {MaterialModule} from 'app/material.module';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    RouterModule,
  ],
  declarations: [ProjectNotesComponent],
  exports: [ProjectNotesComponent],
})
export class ProjectNotesModule { }
