import {NgModule} from '@angular/core';
import {MaterialModule} from 'app/material.module';
import {CommonModule} from '@angular/common';
import {InventoryItem} from './inventory-item';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
  ],
  declarations: [InventoryItem],
  exports: [InventoryItem],
})
export class InventoryItemModule { }
