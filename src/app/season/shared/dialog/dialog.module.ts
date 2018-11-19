import {NgModule} from '@angular/core';
import {ImportItems} from './import-items/import-items';
import {MaterialModule} from 'app/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {ExportItems} from './export-items/export-items';
import {PromptDialogModule} from './prompt-dialog/prompt-dialog.module';

const DIALOGS = [
  ExportItems,
  ImportItems,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    PromptDialogModule,
    ReactiveFormsModule,
  ],
  declarations: DIALOGS,
  entryComponents: DIALOGS,
  providers: []
})
export class DialogModule { }
