import {NgModule} from '@angular/core';
import {Inventory} from './inventory';
import {MaterialModule} from 'app/material.module';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {InventoryItemModule} from './inventory-item/inventory-item.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    InventoryItemModule,
  ],
  declarations: [Inventory],
  exports: [Inventory],
})
export class InventoryModule { }
