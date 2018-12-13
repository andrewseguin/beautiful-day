import {NgModule} from '@angular/core';
import {EditableChipList} from 'app/season/shared/editable-chip-list/editable-chip-list';
import {MaterialModule} from 'app/material.module';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [
    MaterialModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  declarations: [EditableChipList],
  exports: [EditableChipList],
})
export class EditableChipListModule {}
