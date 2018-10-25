import {Component} from '@angular/core';
import {MatDialog} from '@angular/material';
import {PermissionsService} from 'app/ui/season/services/permissions.service';
import {ImportItemsComponent} from 'app/ui/season/shared/dialog/import-items/import-items.component';
import {ExportItemsComponent} from 'app/ui/season/shared/dialog/export-items/export-items.component';
import {take} from 'rxjs/operators';
import {Report} from 'app/model';
import {RequestRendererOptions} from 'app/ui/season/shared/requests-list/render/request-renderer-options';
import {ProjectsDao} from 'app/ui/season/dao/projects-dao';
import {ReportsDao} from 'app/ui/season/dao/reports-dao';
import {RequestsDao} from 'app/ui/season/dao';
import {AngularFirestore} from '@angular/fire/firestore';

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
              private afs: AngularFirestore,
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

  fixProjectLeadAndDirectors() {
    /*
    this.projectsDao.list.subscribe(projects => {
      if (!projects) {
        return;
      }

      const updates: Project[] = [];
      projects.forEach(project => {
        let update: Project = {id: project.id};

        if (typeof project.leads === 'string') {
          update.leads = project.leads.split(',');
        }

        if (typeof project.directors === 'string') {
          update.directors = project.directors.split(',');
        }

        if (typeof project.whitelist === 'string') {
          update.whitelist = project.whitelist.split(',').filter(s => s);
        }

        if (typeof project.acquisitions === 'string') {
          update.acquisitions = project.acquisitions.split(',');
        }

        updates.push(update);
      });

      updates.forEach(update => {
        this.projectsDao.update(update.id, update);
      });

      console.log(updates);
    });
    */
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

  copyData() {
    const seasons = ['2017', '2018'];
    const paths = ['config', 'events', 'groups', 'items', 'projects', 'reports', 'requests'];

    seasons.forEach(season => {
      paths.forEach(path => {
        const originalCollection = this.afs.collection(path);
        originalCollection.snapshotChanges().pipe(take(1)).subscribe(values => {
          values.forEach(value => {
            const id = value.payload.doc.id;
            const data = value.payload.doc.data();
            this.afs.collection(`seasons/${season}/${path}`).doc(id).set(data);
          });
        });
      });
    });
  }

  filterProjects() {

  }
}
