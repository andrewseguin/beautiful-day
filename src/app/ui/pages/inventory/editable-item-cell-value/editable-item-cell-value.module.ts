import {NgModule} from '@angular/core';
import {EditableItemCellValueComponent} from './editable-item-cell-value.component';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [EditableItemCellValueComponent],
  exports: [EditableItemCellValueComponent],
})
export class EditableItemCellValueModule { }
