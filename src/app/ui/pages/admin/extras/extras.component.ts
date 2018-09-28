import {Component} from '@angular/core';
import {MatDialog} from '@angular/material';
import {PermissionsService} from 'app/service/permissions.service';
import {EditGroupComponent} from 'app/ui/pages/shared/dialog/edit-group/edit-group.component';
import {ImportItemsComponent} from 'app/ui/pages/shared/dialog/import-items/import-items.component';
import {ExportItemsComponent} from 'app/ui/pages/shared/dialog/export-items/export-items.component';

@Component({
  selector: 'extras',
  styleUrls: ['extras.component.scss'],
  templateUrl: 'extras.component.html'
})
export class ExtrasComponent {

  constructor(private mdDialog: MatDialog,
              private permissionsService: PermissionsService) {}

  manageAdmins(): void {
    const dialogRef = this.mdDialog.open(EditGroupComponent);
    dialogRef.componentInstance.group = 'admins';
  }

  manageAcquisitions(): void {
    const dialogRef = this.mdDialog.open(EditGroupComponent);
    dialogRef.componentInstance.group = 'acquisitions';
  }

  manageApprovers(): void {
    const dialogRef = this.mdDialog.open(EditGroupComponent);
    dialogRef.componentInstance.group = 'approvers';
  }

  importItems(): void {
    this.mdDialog.open(ImportItemsComponent);
  }

  exportItems(): void {
    this.mdDialog.open(ExportItemsComponent);
  }
}
