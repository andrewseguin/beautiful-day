import {NgModule} from '@angular/core';
import {ManageGroupsComponent} from './manage-groups.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from 'app/material.module';
import {CommonModule} from '@angular/common';
import {
  EditableChipListModule
} from 'app/ui/season/shared/editable-chip-list/editable-chip-list.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    EditableChipListModule,
  ],
  declarations: [ManageGroupsComponent],
  exports: [ManageGroupsComponent],
})
export class ManageGroupsModule { }
