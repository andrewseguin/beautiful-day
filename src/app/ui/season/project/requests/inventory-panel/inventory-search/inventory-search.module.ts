import {NgModule} from '@angular/core';
import {InventorySearchComponent} from './inventory-search.component';
import {MaterialModule} from 'app/material.module';
import {FormsModule} from '@angular/forms';

@NgModule({
  imports: [
    FormsModule,
    MaterialModule,
  ],
  declarations: [InventorySearchComponent],
  exports: [InventorySearchComponent],
})
export class InventorySearchModule { }
