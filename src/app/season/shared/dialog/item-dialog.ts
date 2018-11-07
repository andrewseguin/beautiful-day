import {Injectable} from '@angular/core';
import {ItemsDao} from 'app/season/dao';
import {MatDialog} from '@angular/material';

@Injectable()
export class ItemDialog {
  constructor(private dialog: MatDialog,
              private itemsDao: ItemsDao) {}


}