import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatDialog} from '@angular/material';
import {Permissions} from 'app/season/services/permissions';
import {ImportItems} from 'app/season/shared/dialog/import-items/import-items';
import {ExportItems} from 'app/season/shared/dialog/export-items/export-items';
import {take} from 'rxjs/operators';
import {RequestRendererOptions} from 'app/season/services/requests-renderer/request-renderer-options';
import {
  Item,
  ItemsDao,
  Project,
  ProjectsDao,
  Report,
  ReportsDao,
  RequestsDao
} from 'app/season/dao';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireDatabase} from '@angular/fire/database';
import { firestore } from 'firebase/app';
import {User, UsersDao} from 'app/service/users-dao';

@Component({
  selector: 'owner',
  styleUrls: ['owner.scss'],
  templateUrl: 'owner.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Owner {

  constructor(public dialog: MatDialog,
              private reportsDao: ReportsDao,
              private projectsDao: ProjectsDao,
              private requestsDao: RequestsDao,
              private itemsDao: ItemsDao,
              private usersDao: UsersDao,
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
        const categories = item.categories.map(v => {
          return v.split('>').map(tokens => tokens.trim()).join(' > ');
        });
        categoryCleanup.set(item.id, {categories});
      });

      cleanedUp = true;

      categoryCleanup.forEach((value, key) => {
        this.itemsDao.update(key, value);
      });
    });
  }

  cleanupDropoff() {
    let cleanedUp = false;
    this.projectsDao.list.subscribe(projects => {
      if (cleanedUp || !projects) {
        return;
      }

      const defaultCleanup = new Map<string, any>();

      projects.forEach(project => {
        defaultCleanup.set(project.id, {
          //defaultDropoffDate: project.lastUsedDate || '',
          //defaultDropoffLocation: project.lastUsedDropoff || '',
          //lastUsedDate: firestore.FieldValue.delete(),
          //lastUsedDropoff: firestore.FieldValue.delete(),
        });
      });

      cleanedUp = true;

      defaultCleanup.forEach((value, key) => {
        this.projectsDao.update(key, value);
      });
    });
  }

  cleanupUsers() {
    this.usersDao.list.subscribe(users => {
      if (!users) {
        return;
      }

      const usersMap = new Map<string, User[]>();
      users.forEach(user => {
        if (!usersMap.has(user.email)) {
          usersMap.set(user.email, []);
        }

        usersMap.get(user.email).push(user);
      });

      usersMap.forEach(value => {
        if (value.length > 1) {
          value.forEach(v => {
            this.usersDao.remove(v.id);
          });
        }
      });
    });
  }

  migrateUsers() {
    this.db.list('users').snapshotChanges().subscribe(users => {
      users.forEach(user => {
        const value = user.payload.val();
        const newUser: User = {
          id: user.key,
          email: value['email'],
        };

        if (value['name']) {
          newUser.name = value['name'];
        }

        if (value['phone']) {
          newUser.phone = value['phone'];
        }

        if (value['pic']) {
          newUser.pic = value['pic'];
        }

        this.usersDao.add(newUser);
      });
    });
  }
}
