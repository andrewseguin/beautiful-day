import {NgModule} from '@angular/core';
import {MaterialModule} from 'app/material.module';
import {ImportFromFile} from './import-from-file';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
  ],
  declarations: [ImportFromFile],
  exports: [ImportFromFile],
  entryComponents: [ImportFromFile]
})
export class ImportFromFileModule { }
