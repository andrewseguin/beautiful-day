import {NgModule} from '@angular/core';
import {SlidingPanel} from './sliding-panel';
import {MaterialModule} from 'app/material.module';
import {CommonModule} from '@angular/common';
import {InventoryListModule} from '../inventory-list/inventory-list.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    InventoryListModule,
  ],
  declarations: [SlidingPanel],
  exports: [SlidingPanel],
})
export class SlidingPanelModule { }
