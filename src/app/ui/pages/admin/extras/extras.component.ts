import {Component} from '@angular/core';
import {MatDialog} from '@angular/material';
import {PermissionsService} from 'app/service/permissions.service';
import {ImportItemsComponent} from 'app/ui/pages/shared/dialog/import-items/import-items.component';
import {ExportItemsComponent} from 'app/ui/pages/shared/dialog/export-items/export-items.component';
import {take} from 'rxjs/operators';
import {Report} from 'app/model/report';
import {RequestRendererOptions} from 'app/ui/pages/shared/requests-list/render/request-renderer-options';
import {ProjectsDao} from 'app/service/dao/projects-dao';
import {ReportsDao} from 'app/service/dao/reports-dao';
import {RequestsDao} from 'app/service/dao';

@Component({
  selector: 'extras',
  styleUrls: ['extras.component.scss'],
  templateUrl: 'extras.component.html'
})
export class ExtrasComponent {

  constructor(public dialog: MatDialog,
              private reportsDao: ReportsDao,
              private projectsDao: ProjectsDao,
              private requestsDao: RequestsDao,
              public permissionsService: PermissionsService) {
  }

  importItems(): void {
    this.dialog.open(ImportItemsComponent);
  }

  exportItems(): void {
    this.dialog.open(ExportItemsComponent);
  }

  createReports(): void {
    this.projectsDao.list.subscribe(projects => {
      const reports: Report[] = [];

      if (!projects) {
        return;
      }

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
        this.reportsDao.add(report);
      });
    });

    this.requestsDao.list.pipe(take(1)).subscribe(requests => {
      if (!requests) {
        return;
      }

      const purchasers = new Set<string>();
      requests.forEach(r => purchasers.add(r.purchaser));

      for (let purchaser of Array.from(purchasers.values())) {
        const options = new RequestRendererOptions();
        options.showProjectName = true;
        options.filters = [
          {type: 'season', query: {season: '2018'}},
          {type: 'purchaser', query: {purchaser: purchaser}}
        ];

        const report = {
          name: purchaser,
          group: 'Purchaser',
          options: options.getState()
        };

        this.reportsDao.add(report);
      }
    });
  }
/*
  copyRequests() {
    this.requestsService.requests.subscribe(requests => {
      requests.forEach(request => {
        const id = request.$key;
        delete request.$key;
        this.requestsDao.add({id, ...request});
      });
    });
  }
  */
}
