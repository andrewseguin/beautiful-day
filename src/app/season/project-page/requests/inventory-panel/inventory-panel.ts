import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {PanelsManager} from './panels-manager';
import {Item, ItemsDao} from 'app/season/dao';
import {map} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {getCategoryGroup} from 'app/utility/items-categorize';

@Component({
  selector: 'inventory-panel',
  templateUrl: 'inventory-panel.html',
  styleUrls: ['inventory-panel.scss'],
  providers: [PanelsManager],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InventoryPanel {
  search = new FormControl('');
  itemTrackBy = (_i, item: Item) => item.id;

  categories = this.itemsDao.list.pipe(map(items => {
    if (items) {
      return getCategoryGroup(items).subcategories;
    }
  }));

  @Input() project: string;

  @Output('closeSidenav') closeSidenav = new EventEmitter<void>();

  constructor(public itemsDao: ItemsDao,
              public panelsManager: PanelsManager) {}
}
