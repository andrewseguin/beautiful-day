import {NgModule} from '@angular/core';
import {DeleteProject} from './delete-project/delete-project';
import {EditItem} from './edit-item/edit-item';
import {EditItemCategory} from './edit-item-category/edit-item-category';
import {EditItemName} from './edit-item-name/edit-item-name';
import {EditProject} from './edit-project/edit-project';
import {EditUserProfile} from './edit-user-profile/edit-user-profile';
import {ImportItems} from './import-items/import-items';
import {MaterialModule} from 'app/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {PipeModule} from 'app/pipe/pipe.module';
import {ExportItems} from './export-items/export-items';
import {ReportDialog} from 'app/ui/season/shared/dialog/report-dialog';
import {ReportEditModule} from 'app/ui/season/shared/dialog/report-edit/report-edit.module';
import {ItemDialog} from 'app/ui/season/shared/dialog/item-dialog';
import {PromptDialogModule} from 'app/ui/season/shared/dialog/prompt-dialog/prompt-dialog.module';

const DIALOGS = [
  DeleteProject,
  EditItem,
  EditItemCategory,
  EditItemName,
  EditProject,
  EditUserProfile,
  ExportItems,
  ImportItems,
];

@NgModule({
  imports: [
    PipeModule,
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
