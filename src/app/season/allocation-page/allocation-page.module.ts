import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MaterialModule} from 'app/material.module';
import {LoadingModule} from 'app/season/shared/loading/loading.module';
import {AllocationPage} from './allocation-page';

const routes: Routes = [{path: '', component: AllocationPage}];

@NgModule({imports: [RouterModule.forChild(routes)], exports: [RouterModule]})
export class AllocationPageRoutingModule {}

@NgModule({
  imports: [
    MaterialModule,
    CommonModule,
    LoadingModule,
    AllocationPageRoutingModule,
  ],
  declarations: [AllocationPage],
  exports: [AllocationPage],
})
export class AllocationPageModule { }
