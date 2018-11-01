import {NgModule} from '@angular/core';
import {InventorySearch} from './inventory-search';
import {MaterialModule} from 'app/material.module';
import {FormsModule} from '@angular/forms';

@NgModule({
  imports: [
    FormsModule,
    MaterialModule,
  ],
  declarations: [InventorySearch],
  exports: [InventorySearch],
})
export class InventorySearchModule { }
