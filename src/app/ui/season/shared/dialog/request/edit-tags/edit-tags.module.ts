import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from 'app/material.module';
import {CommonModule} from '@angular/common';
import {EditTags} from 'app/ui/season/shared/dialog/request/edit-tags/edit-tags';
import {EditableChipListModule} from 'app/ui/season/shared/editable-chip-list/editable-chip-list.module';

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

