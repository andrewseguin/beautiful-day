import {Component} from '@angular/core';
import {EditGroupComponent} from '../shared/dialog/edit-group/edit-group.component';
import {ImportItemsComponent} from '../shared/dialog/import-items/import-items.component';
import {ExportItemsComponent} from '../shared/dialog/export-items/export-items.component';
import {MatDialog} from '@angular/material';
import {PermissionsService} from 'app/service/permissions.service';

@Component({
  styleUrls: ['admin.component.scss'],
  templateUrl: 'admin.component.html'
})
export class AdminComponent {

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
