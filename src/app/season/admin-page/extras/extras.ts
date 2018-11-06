import {Component} from '@angular/core';
import {MatDialog} from '@angular/material';
import {Permissions} from 'app/season/services/permissions';
import {ImportItems} from 'app/season/shared/dialog/import-items/import-items';
import {ExportItems} from 'app/season/shared/dialog/export-items/export-items';
import {take} from 'rxjs/operators';
import {
  RequestRendererOptions
} from 'app/season/shared/requests-list/render/request-renderer-options';
import {Item, ItemsDao, ProjectsDao, Report, ReportsDao, RequestsDao} from 'app/season/dao';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireDatabase} from '@angular/fire/database';

@Component({
  selector: 'extras',
  styleUrls: ['extras.scss'],
  templateUrl: 'extras.html'
})
export class Extras {

  constructor(public dialog: MatDialog,
              private reportsDao: ReportsDao,
              private projectsDao: ProjectsDao,
              private requestsDao: RequestsDao,
              private itemsDao: ItemsDao,
              protected db: AngularFireDatabase,
              private afs: AngularFirestore,
              public permissions: Permissions) {
  }

  importItems(): void {
    this.dialog.open(ImportItems);
  }

  exportItems(): void {
    this.dialog.open(ExportItems);
  }

  createReports(): void {
    let projectsMade = false;
    this.projectsDao.list.subscribe(projects => {
      if (projectsMade) {
        return;
      }
      const reports: Report[] = [];

      if (!projects || projectsMade) {
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
          group: 'Projects',
          options: options.getState()
        });
      });

      reports.forEach(report => {
        this.reportsDao.add(report);
      });

      projectsMade = true;
    });

    let purchasersMade = false;
    this.requestsDao.list.subscribe(requests => {
      if (!requests || purchasersMade) {
        return;
      }

      const purchasers = new Set<string>();
      requests.forEach(r => purchasers.add(r.purchaser));

      for (let purchaser of Array.from(purchasers.values())) {
        if (!purchaser) {
          continue;
        }
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

      purchasersMade = true;
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

  cleanupItems() {
    let cleanedUp = false;
    this.itemsDao.list.subscribe(items => {
      if (cleanedUp || !items) {
        return;
      }

      const categoryCleanup = new Map<string, Item>();

      items.forEach(item => {
        const categories = item.categories.map(v => v.trim());
        categoryCleanup.set(item.id, {categories});
      });

      cleanedUp = true;

      categoryCleanup.forEach((value, key) => {
        this.itemsDao.update(key, value);
      });
    });
  }
}
