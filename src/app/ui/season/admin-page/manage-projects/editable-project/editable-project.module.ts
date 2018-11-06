import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from 'app/material.module';
import {EditableProject} from './editable-project';
import {ReactiveFormsModule} from '@angular/forms';
import {
  EditableChipListModule
} from 'app/ui/season/shared/editable-chip-list/editable-chip-list.module';

@NgModule({
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, EditableChipListModule],
  declarations: [EditableProject],
  exports: [EditableProject],
})
export class EditableProjectModule { }
