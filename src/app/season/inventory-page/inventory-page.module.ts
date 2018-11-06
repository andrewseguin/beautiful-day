import {NgModule} from '@angular/core';
import {InventoryPage} from './inventory-page';
import {MaterialModule} from 'app/material.module';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {InventoryItemModule} from './inventory-item/inventory-item.module';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [{path: '', component: InventoryPage}];

@NgModule({imports: [RouterModule.forChild(routes)], exports: [RouterModule]})
export class InventoryPageRoutingModule {}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    InventoryItemModule,
    InventoryPageRoutingModule
  ],
  declarations: [InventoryPage],
  exports: [InventoryPage],
})
export class InventoryPageModule { }
