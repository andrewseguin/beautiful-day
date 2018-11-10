import {Injectable} from '@angular/core';
import {take} from 'rxjs/operators';
import {MatDialog} from '@angular/material';
import {Item, ItemsDao} from 'app/season/dao';
import {CreateItem} from './create-item/create-item';

@Injectable()
export class ItemDialog {
  constructor(private dialog: MatDialog,
              private itemsDao: ItemsDao) {}

  createItem(category: string) {
    this.dialog.open(CreateItem, {data: {category}, width: '400px'}).afterClosed().pipe(
      take(1))
      .subscribe((result: Item) => {
        if (result) {
          console.log(result);
          this.itemsDao.add(result);
        }
      });
  }
}
