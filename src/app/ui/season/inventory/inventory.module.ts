import {NgModule} from '@angular/core';
import {InventoryComponent} from './inventory.component';
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
  declarations: [InventoryComponent],
  exports: [InventoryComponent],
})
export class InventoryModule { }
