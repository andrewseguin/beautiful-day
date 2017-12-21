import {NgModule} from '@angular/core';
import {SlidingPanelComponent} from './sliding-panel.component';
import {MaterialModule} from 'app/material.module';
import {CommonModule} from '@angular/common';
import {InventoryListModule} from '../inventory-list/inventory-list.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    InventoryListModule,
  ],
  declarations: [SlidingPanelComponent],
  exports: [SlidingPanelComponent],
})
export class SlidingPanelModule { }
