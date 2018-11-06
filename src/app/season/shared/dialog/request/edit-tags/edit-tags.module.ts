import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from 'app/material.module';
import {CommonModule} from '@angular/common';
import {EditTags} from './edit-tags';
import {EditableChipListModule} from '../../../editable-chip-list/editable-chip-list.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    EditableChipListModule
  ],
  declarations: [EditTags],
  exports: [EditTags],
  entryComponents: [EditTags]
})
export class EditTagsModule { }

