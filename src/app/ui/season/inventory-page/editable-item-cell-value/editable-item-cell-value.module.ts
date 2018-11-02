import {NgModule} from '@angular/core';
import {EditableItemCellValue} from './editable-item-cell-value';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [EditableItemCellValue],
  exports: [EditableItemCellValue],
})
export class EditableItemCellValueModule { }
