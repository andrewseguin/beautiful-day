import {NgModule} from '@angular/core';
import {ExportPage} from 'app/season/export-page/export-page';
import {MaterialModule} from 'app/material.module';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [{path: '', component: ExportPage}];

@NgModule({imports: [RouterModule.forChild(routes)], exports: [RouterModule]})
export class ExportPageRoutingModule {}

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    ExportPageRoutingModule
  ],
  declarations: [ExportPage],
  exports: [ExportPage],
})
export class ExportPageModule { }
