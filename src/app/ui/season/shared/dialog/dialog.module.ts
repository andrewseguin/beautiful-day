import {NgModule} from '@angular/core';
import {DeleteProjectComponent} from './delete-project/delete-project.component';
import {DeleteReportComponent} from './delete-report/delete-report.component';
import {DeleteRequestsComponent} from './delete-requests/delete-requests.component';
import {EditItemComponent} from './edit-item/edit-item.component';
import {EditItemCategoryComponent} from './edit-item-category/edit-item-category.component';
import {EditItemNameComponent} from './edit-item-name/edit-item-name.component';
import {EditProjectComponent} from './edit-project/edit-project.component';
import {EditUserProfileComponent} from './edit-user-profile/edit-user-profile.component';
import {ImportItemsComponent} from './import-items/import-items.component';
import {MaterialModule} from 'app/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {PipeModule} from 'app/pipe/pipe.module';
import {ExportItemsComponent} from './export-items/export-items.component';
import {ReportDialog} from 'app/ui/season/shared/dialog/report-dialog';
import {EventDialog} from 'app/ui/season/shared/dialog/event-dialog';
import {ReportEditModule} from 'app/ui/season/shared/dialog/report-edit/report-edit.module';
import {EventEditModule} from 'app/ui/season/shared/dialog/event-edit/event-edit.module';
import {ItemDialog} from 'app/ui/season/shared/dialog/item-dialog';
import {PromptDialogModule} from 'app/ui/season/shared/dialog/prompt-dialog/prompt-dialog.module';

const DIALOGS = [
  DeleteProjectComponent,
  DeleteReportComponent,
  DeleteRequestsComponent,
  EditItemComponent,
  EditItemCategoryComponent,
  EditItemNameComponent,
  EditProjectComponent,
  EditUserProfileComponent,
  ExportItemsComponent,
  ImportItemsComponent,
];

@NgModule({
  imports: [
    PipeModule,
    CommonModule,
    FormsModule,
    MaterialModule,
    ReportEditModule,
    EventEditModule,
    PromptDialogModule,
    ReactiveFormsModule,
  ],
  declarations: DIALOGS,
  entryComponents: DIALOGS,
  providers: [
    ReportDialog,
    EventDialog,
    ItemDialog,
  ]
})
export class DialogModule { }
