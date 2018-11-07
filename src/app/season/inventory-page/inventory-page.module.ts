import {NgModule} from '@angular/core';
import {InventoryPage} from './inventory-page';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [{path: '', component: InventoryPage}];

@NgModule({imports: [RouterModule.forChild(routes)], exports: [RouterModule]})
export class InventoryPageRoutingModule {}

@NgModule({
  imports: [
    InventoryPageRoutingModule
  ],
  declarations: [InventoryPage],
  exports: [InventoryPage],
})
export class InventoryPageModule { }
