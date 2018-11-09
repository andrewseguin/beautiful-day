import {NgModule} from '@angular/core';
import {PrintPage} from './print-page';
import {RouterModule, Routes} from '@angular/router';
import {CommonModule} from '@angular/common';
import {MaterialModule} from 'app/material.module';
import {LoadingModule} from 'app/season/shared/loading/loading.module';

const routes: Routes = [{path: '', component: PrintPage}];

@NgModule({imports: [RouterModule.forChild(routes)], exports: [RouterModule]})
export class PrintPageRoutingModule {}

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    LoadingModule,
    PrintPageRoutingModule
  ],
  declarations: [PrintPage],
  exports: [PrintPage],
})
export class PrintPageModule { }
