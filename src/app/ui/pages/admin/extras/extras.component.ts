import {Component} from '@angular/core';
import {MatDialog} from '@angular/material';
import {PermissionsService} from 'app/service/permissions.service';
import {EditGroupComponent} from 'app/ui/pages/shared/dialog/edit-group/edit-group.component';
import {ImportItemsComponent} from 'app/ui/pages/shared/dialog/import-items/import-items.component';
import {ExportItemsComponent} from 'app/ui/pages/shared/dialog/export-items/export-items.component';
import {RequestsService} from 'app/service/requests.service';
import {ProjectsService} from 'app/service/projects.service';
import {ReportsService} from 'app/service/reports.service';
import {take} from 'rxjs/operators';
import {Report} from 'app/model/report';
import {
  RequestRendererOptions
} from 'app/ui/pages/shared/requests-list/render/request-renderer-options';

@Component({
  selector: 'extras',
  styleUrls: ['extras.component.scss'],
  templateUrl: 'extras.component.html'
})
export class ExtrasComponent {

  constructor(public mdDialog: MatDialog,
              private reportsService: ReportsService,
              private projectsService: ProjectsService,
              private requestsService: RequestsService,
              public permissionsService: PermissionsService) {}

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

  createReports(): void {
    this.projectsService.projects.pipe(take(1)).subscribe(projects => {
      const reports: Report[] = [];

      projects.forEach(project => {
        const options = new RequestRendererOptions();
        options.showProjectName = true;
        options.filters = [
          {type: 'season', query: {season: '2018'}},
          {type: 'project', query: {project: project.name}}
        ];
        reports.push({
          name: project.name,
          group: '2018 Projects',
          options: options.getState()
        });
      });

      reports.forEach(report => {
        this.reportsService.create(report.name, report.group, report.options);
      });
    });

    this.requestsService.requests.pipe(take(1)).subscribe(requests => {
      const purchasers = new Set<string>();
      requests.forEach(r => purchasers.add(r.purchaser));

      for (let purchaser of Array.from(purchasers.values())) {
        const options = new RequestRendererOptions();
        options.showProjectName = true;
        options.filters = [
          {type: 'season', query: {season: '2018'}},
          {type: 'purchaser', query: {purchaser: purchaser}}
        ];
        this.reportsService.create(purchaser, 'Purchaser', options.getState());
      }
    });
  }
}
