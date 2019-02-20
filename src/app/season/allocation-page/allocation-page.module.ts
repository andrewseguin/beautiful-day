import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MaterialModule} from 'app/material.module';
import {LoadingModule} from 'app/season/shared/loading/loading.module';
import {AllocationPage} from './allocation-page';
import {StockedItemModule} from './stocked-item/stocked-item.module';
import {StockedRequestModule} from './stocked-request/stocked-request.module';

const routes: Routes = [{path: '', component: AllocationPage}];

@NgModule({imports: [RouterModule.forChild(routes)], exports: [RouterModule]})
export class AllocationPageRoutingModule {
}

@NgModule({
  imports: [
    MaterialModule,
    CommonModule,
    LoadingModule,
    StockedItemModule,
    StockedRequestModule,
    AllocationPageRoutingModule,
  ],
  declarations: [AllocationPage],
  exports: [AllocationPage],
})
export class AllocationPageModule {
}
