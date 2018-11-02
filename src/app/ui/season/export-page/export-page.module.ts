import {NgModule} from '@angular/core';
import {ExportPage} from 'app/ui/season/export-page/export-page';
import {MaterialModule} from 'app/material.module';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule
  ],
  declarations: [ExportPage],
  exports: [ExportPage],
})
export class ExportPageModule { }
