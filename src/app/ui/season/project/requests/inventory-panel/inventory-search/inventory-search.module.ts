import {NgModule} from '@angular/core';
import {InventorySearch} from './inventory-search';
import {MaterialModule} from 'app/material.module';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [
    ReactiveFormsModule,
    MaterialModule,
  ],
  declarations: [InventorySearch],
  exports: [InventorySearch],
})
export class InventorySearchModule { }
