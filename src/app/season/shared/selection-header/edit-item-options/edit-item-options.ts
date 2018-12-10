import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {Selection} from 'app/season/services';
import {ItemsDao} from 'app/season/dao';
import {Subject} from 'rxjs';
import {ItemDialog} from 'app/season/shared/dialog/item/item-dialog';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'edit-item-options',
  templateUrl: 'edit-item-options.html',
  styleUrls: ['edit-item-options.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditItemOptions {
  editOptions = [
    {id: 'name', label: 'Name'},
    {id: 'categories', label: 'Categories'},
    {id: 'cost', label: 'Cost'},
    {id: 'stock', label: 'Stock'},
    {id: 'approved', label: 'Approved'},
    {id: 'hidden', label: 'Hidden'},
    {id: 'url', label: 'Url'}
  ];

  private destroyed = new Subject();

  constructor(private itemsDao: ItemsDao,
              private itemDialog: ItemDialog,
              private cd: ChangeDetectorRef,
              private selection: Selection) {
    this.selection.items.changed.pipe(
        takeUntil(this.destroyed))
        .subscribe(() => this.cd.markForCheck());
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  edit(type: string) {
    const selected = this.selection.items.selected;
    switch (type) {
      case 'name':
        this.itemDialog.editName(selected); break;
      case 'categories':
        this.itemDialog.editCategories(selected); break;
      case 'cost':
        this.itemDialog.editCost(selected); break;
      case 'stock':
        this.itemDialog.editStock(selected); break;
      case 'approved':
        this.itemDialog.editApproved(selected); break;
      case 'hidden':
        this.itemDialog.editHidden(selected); break;
      case 'url':
        this.itemDialog.editUrl(selected); break;
    }
  }

  deleteItems() {
    this.itemDialog.deleteItems(this.selection.items.selected);
  }
}
