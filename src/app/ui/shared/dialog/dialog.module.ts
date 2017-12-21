import {NgModule} from '@angular/core';
import {DeleteNoteComponent} from 'app/ui/shared/dialog/delete-note/delete-note.component';
import {DeleteProjectComponent} from 'app/ui/shared/dialog/delete-project/delete-project.component';
import {DeleteReportComponent} from 'app/ui/shared/dialog/delete-report/delete-report.component';
import {DeleteRequestsComponent} from 'app/ui/shared/dialog/delete-requests/delete-requests.component';
import {EditApprovalStatusDialogComponent} from 'app/ui/shared/dialog/edit-approval-status/edit-approval-status';
import {EditDropoffComponent} from 'app/ui/shared/dialog/edit-dropoff/edit-dropoff.component';
import {EditEventComponent} from 'app/ui/shared/dialog/edit-event/edit-event.component';
import {EditGroupComponent} from 'app/ui/shared/dialog/edit-group/edit-group.component';
import {EditItemComponent} from 'app/ui/shared/dialog/edit-item/edit-item.component';
import {EditItemCategoryComponent} from 'app/ui/shared/dialog/edit-item-category/edit-item-category.component';
import {EditItemNameComponent} from 'app/ui/shared/dialog/edit-item-name/edit-item-name.component';
import {EditProjectComponent} from 'app/ui/shared/dialog/edit-project/edit-project.component';
import {EditPurchaseStatusDialogComponent} from 'app/ui/shared/dialog/edit-purchase-status/edit-purchase-status';
import {EditTagsComponent} from 'app/ui/shared/dialog/edit-tags/edit-tags.component';
import {EditUserProfileComponent} from 'app/ui/shared/dialog/edit-user-profile/edit-user-profile.component';
import {ImportItemsComponent} from 'app/ui/shared/dialog/import-items/import-items.component';
import {PromptDialogComponent} from 'app/ui/shared/dialog/prompt-dialog/prompt-dialog.component';
import {MaterialModule} from 'app/material.module';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {PipeModule} from 'app/pipe/pipe.module';

@NgModule({
  imports: [
    PipeModule,
    CommonModule,
    FormsModule,
    MaterialModule
  ],
  declarations: [
    DeleteNoteComponent,
    DeleteProjectComponent,
    DeleteReportComponent,
    DeleteRequestsComponent,
    EditApprovalStatusDialogComponent,
    EditDropoffComponent,
    EditEventComponent,
    EditGroupComponent,
    EditItemComponent,
    EditItemCategoryComponent,
    EditItemNameComponent,
    EditProjectComponent,
    EditPurchaseStatusDialogComponent,
    EditTagsComponent,
    EditUserProfileComponent,
    ImportItemsComponent,
    PromptDialogComponent,
  ],
  exports: [
    DeleteNoteComponent,
    DeleteProjectComponent,
    DeleteReportComponent,
    DeleteRequestsComponent,
    EditApprovalStatusDialogComponent,
    EditDropoffComponent,
    EditEventComponent,
    EditGroupComponent,
    EditItemComponent,
    EditItemCategoryComponent,
    EditItemNameComponent,
    EditProjectComponent,
    EditPurchaseStatusDialogComponent,
    EditTagsComponent,
    EditUserProfileComponent,
    ImportItemsComponent,
    PromptDialogComponent,
  ],
  entryComponents: [
    DeleteNoteComponent,
    DeleteProjectComponent,
    DeleteReportComponent,
    DeleteRequestsComponent,
    EditApprovalStatusDialogComponent,
    EditDropoffComponent,
    EditEventComponent,
    EditGroupComponent,
    EditItemComponent,
    EditItemCategoryComponent,
    EditItemNameComponent,
    EditProjectComponent,
    EditPurchaseStatusDialogComponent,
    EditTagsComponent,
    EditUserProfileComponent,
    ImportItemsComponent,
    PromptDialogComponent,
  ],
})
export class DialogModule { }
