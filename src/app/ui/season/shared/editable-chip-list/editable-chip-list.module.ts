import {NgModule} from '@angular/core';
import {EditableChipList} from 'app/ui/season/shared/editable-chip-list/editable-chip-list';
import {MaterialModule} from 'app/material.module';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [MaterialModule, CommonModule],
  declarations: [EditableChipList],
  exports: [EditableChipList],
})
export class EditableChipListModule {}
