import {NgModule} from '@angular/core';
import {MaterialModule} from 'app/material.module';
import {CommonModule} from '@angular/common';
import {InventoryItemComponent} from './inventory-item.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
  ],
  declarations: [InventoryItemComponent],
  exports: [InventoryItemComponent],
})
export class InventoryItemModule { }
