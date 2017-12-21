import {NgModule} from '@angular/core';
import {InventoryPanelItemComponent} from './inventory-panel-item.component';
import {MaterialModule} from 'app/material.module';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
  ],
  declarations: [InventoryPanelItemComponent],
  exports: [InventoryPanelItemComponent],
})
export class InventoryPanelItemModule { }
