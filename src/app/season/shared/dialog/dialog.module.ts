import {NgModule} from '@angular/core';
import {EditItem} from './edit-item/edit-item';
import {EditItemCategory} from './edit-item-category/edit-item-category';
import {EditItemName} from './edit-item-name/edit-item-name';
import {EditUserProfile} from './edit-user-profile/edit-user-profile';
import {ImportItems} from './import-items/import-items';
import {MaterialModule} from 'app/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {ExportItems} from './export-items/export-items';
import {ReportDialog} from './report-dialog';
import {ReportEditModule} from './report-edit/report-edit.module';
import {ItemDialog} from './item-dialog';
import {PromptDialogModule} from './prompt-dialog/prompt-dialog.module';

const DIALOGS = [
  EditItem,
  EditItemCategory,
  EditItemName,
  EditUserProfile,
  ExportItems,
  ImportItems,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ReportEditModule,
    PromptDialogModule,
    ReactiveFormsModule,
  ],
  declarations: DIALOGS,
  entryComponents: DIALOGS,
  providers: [
    ReportDialog,
    ItemDialog,
  ]
})
export class DialogModule { }
