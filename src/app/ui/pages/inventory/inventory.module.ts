import {NgModule} from '@angular/core';
import {InventoryComponent} from './inventory.component';
import {
  EditableItemCellValueModule
} from './editable-item-cell-value/editable-item-cell-value.module';
import {MaterialModule} from 'app/material.module';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    EditableItemCellValueModule
  ],
  declarations: [InventoryComponent],
  exports: [InventoryComponent],
})
export class InventoryModule { }
