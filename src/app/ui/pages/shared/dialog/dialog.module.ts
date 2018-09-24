import {NgModule} from '@angular/core';
import {DeleteProjectComponent} from './delete-project/delete-project.component';
import {DeleteReportComponent} from './delete-report/delete-report.component';
import {DeleteRequestsComponent} from './delete-requests/delete-requests.component';
import {EditApprovalStatusDialogComponent} from './edit-approval-status/edit-approval-status';
import {EditDropoffComponent} from './edit-dropoff/edit-dropoff.component';
import {EditEventComponent} from './edit-event/edit-event.component';
import {EditGroupComponent} from './edit-group/edit-group.component';
import {EditItemComponent} from './edit-item/edit-item.component';
import {EditItemCategoryComponent} from './edit-item-category/edit-item-category.component';
import {EditItemNameComponent} from './edit-item-name/edit-item-name.component';
import {EditProjectComponent} from './edit-project/edit-project.component';
import {EditPurchaseStatusDialogComponent} from './edit-purchase-status/edit-purchase-status';
import {EditTagsComponent} from './edit-tags/edit-tags.component';
import {EditUserProfileComponent} from './edit-user-profile/edit-user-profile.component';
import {ImportItemsComponent} from './import-items/import-items.component';
import {PromptDialogComponent} from './prompt-dialog/prompt-dialog.component';
import {MaterialModule} from 'app/material.module';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {PipeModule} from 'app/pipe/pipe.module';
import {ExportItemsComponent} from './export-items/export-items.component';
import {EditDistributionStatusDialogComponent} from 'app/ui/pages/shared/dialog/edit-distribution-status/edit-distribution-status';

@NgModule({
  imports: [
    PipeModule,
    CommonModule,
    FormsModule,
    MaterialModule
  ],
  declarations: [
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
    ExportItemsComponent,
    ImportItemsComponent,
    PromptDialogComponent,
    EditDistributionStatusDialogComponent,
  ],
  entryComponents: [
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
    ExportItemsComponent,
    ImportItemsComponent,
    PromptDialogComponent,
    EditDistributionStatusDialogComponent
  ],
})
export class DialogModule { }
