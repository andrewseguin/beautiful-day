import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Selection} from 'app/season/services';
import {ItemsDao} from 'app/season/dao';
import {Subject} from 'rxjs';

@Component({
  selector: 'edit-item-options',
  templateUrl: 'edit-item-options.html',
  styleUrls: ['edit-item-options.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditItemOptions {

  private destroyed = new Subject();

  constructor(private itemsDao: ItemsDao,
              private selection: Selection) {}

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  isMultiSelect() {
    return this.selection.items.selected.length > 1;
  }

  deleteItem() {
    this.selection.items.selected.forEach(item => {
      this.itemsDao.remove(item);
    });
    this.selection.items.clear();
  }
}
