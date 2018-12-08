import {Injectable} from '@angular/core';
import {take, takeUntil} from 'rxjs/operators';
import {MatDialog} from '@angular/material';
import {ItemsDao, ProjectsDao, RequestsDao} from 'app/season/dao';
import {CreateItem, CreateItemResult} from './create-item/create-item';
import {Subject} from 'rxjs';
import {highlight} from 'app/utility/element-actions';
import {createRequest} from 'app/season/utility/create-request';

@Injectable()
export class ItemDialog {
  categories = [];

  destroyed = new Subject();

  constructor(private dialog: MatDialog,
              private requestsDao: RequestsDao,
              private projectsDao: ProjectsDao,
              private itemsDao: ItemsDao) {
    this.itemsDao.list.pipe(takeUntil(this.destroyed)).subscribe(items => {
      if (!items) {
        return;
      }

      const categories = new Set();
      items.forEach(item => {
        item.categories.forEach(c => {
          if (!c.includes('>')) {
            categories.add(c);
          }
        });
      });

      this.categories = Array.from(categories);
    });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  createItem(category: string, project?: string) {
    const data = {
      category,
      categories: this.categories,
      showRequest: !!project
    };

    this.dialog.open(CreateItem, {data, width: '400px'}).afterClosed().pipe(
      take(1))
      .subscribe((result: CreateItemResult) => {
        if (result) {
          this.itemsDao.add(result.item).then(item => {
            if (result.addRequest) {
              this.makeRequest(project, item);
            }
          });
        }
      });
  }

  private makeRequest(project: string, item: string) {
    this.projectsDao.get(project).pipe(take(1)).subscribe(project => {
      const request = createRequest(project, item, 1);
      this.requestsDao.add(request).then(id => {
        highlight(id);
      });
    });
  }
}
