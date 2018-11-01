import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {Item} from 'app/model/item';
import {ItemsDao, RequestsDao} from 'app/ui/season/dao';

@Component({
  templateUrl: 'export-items.html',
  styleUrls: ['export-items.scss']
})
export class ExportItems {
  items: Item[];
  itemRequestCount: Map<string, number>;

  constructor(private dialogRef: MatDialogRef<ExportItems>,
              private itemsDao: ItemsDao,
              private requestsDao: RequestsDao) {
    this.itemsDao.list.subscribe(items => {
      this.items = items;
    });

    this.requestsDao.list.subscribe(requests => {
      if (!requests) {
        return;
      }

      this.itemRequestCount = new Map();
      requests.forEach(request => {
        let count = (this.itemRequestCount.get(request.item) || 0) + 1;
        this.itemRequestCount.set(request.item, count);
      });
    });
  }

  close() {
    this.dialogRef.close();
  }

  copyToClipboard(table) {
    const range = document.createRange();
    const selection = window.getSelection();

    range.selectNodeContents(table);
    selection.removeAllRanges();
    selection.addRange(range);

    document.execCommand('copy');
  }
}
