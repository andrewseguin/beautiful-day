import {NgModule} from '@angular/core';
import {InventoryPanelItem} from './inventory-panel-item';
import {MaterialModule} from 'app/material.module';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
  ],
  declarations: [InventoryPanelItem],
  exports: [InventoryPanelItem],
})
export class InventoryPanelItemModule { }
