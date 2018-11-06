import {NgModule} from '@angular/core';
import {ManageGroups} from './manage-groups';
import {ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from 'app/material.module';
import {CommonModule} from '@angular/common';
import {
  EditableChipListModule
} from 'app/season/shared/editable-chip-list/editable-chip-list.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    EditableChipListModule,
  ],
  declarations: [ManageGroups],
  exports: [ManageGroups],
})
export class ManageGroupsModule { }
