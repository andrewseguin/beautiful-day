import {NgModule} from '@angular/core';
import {ManageGroupsComponent} from './manage-groups.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from 'app/material.module';
import {CommonModule} from '@angular/common';
import {EditableGroupModule} from './editable-group/editable-group.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    EditableGroupModule,
  ],
  declarations: [ManageGroupsComponent],
  exports: [ManageGroupsComponent],
})
export class ManageGroupsModule { }
