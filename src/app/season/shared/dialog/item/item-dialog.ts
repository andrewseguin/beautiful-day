import {Injectable} from '@angular/core';
import {take, takeUntil} from 'rxjs/operators';
import {MatDialog} from '@angular/material';
import {Item, ItemsDao} from 'app/season/dao';
import {CreateItem} from './create-item/create-item';
import {Subject} from 'rxjs';

@Injectable()
export class ItemDialog {
  categories = [];

  destroyed = new Subject();

  constructor(private dialog: MatDialog,
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

  createItem(category: string) {
    const data = {
      category,
      categories: this.categories
    };

    this.dialog.open(CreateItem, {data, width: '400px'}).afterClosed().pipe(
      take(1))
      .subscribe((result: Item) => {
        if (result) {
          console.log(result);
          this.itemsDao.add(result);
        }
      });
  }
}
