import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {Item, ItemsDao, RequestsDao} from 'app/ui/season/dao';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  templateUrl: 'export-items.html',
  styleUrls: ['export-items.scss']
})
export class ExportItems {
  items: Item[];
  itemRequestCount: Map<string, number>;

  private destroyed = new Subject();

  constructor(private dialogRef: MatDialogRef<ExportItems>,
              private itemsDao: ItemsDao,
              private requestsDao: RequestsDao) {
    this.itemsDao.list.pipe(takeUntil(this.destroyed)).subscribe(items => {
      this.items = items;
    });

    this.requestsDao.list.pipe(takeUntil(this.destroyed)).subscribe(requests => {
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

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
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
