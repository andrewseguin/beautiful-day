import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Item} from 'app/model/item';
import {Project} from 'app/model/project';
import {Observable} from 'rxjs/Observable';
import {PanelsManager} from './panels-manager';
import {ItemsDao} from 'app/ui/season/dao';
import {getCategoryGroup} from 'app/utility/items-categorize';

@Component({
  selector: 'inventory-panel',
  templateUrl: 'inventory-panel.html',
  styleUrls: ['inventory-panel.scss'],
  providers: [PanelsManager]
})
export class InventoryPanel implements OnInit {
  subcategories: string[];
  project: Observable<Project>;
  items: Item[];

  search = '';

  @Output('closeSidenav') closeSidenav = new EventEmitter<void>();

  constructor(private itemsDao: ItemsDao,
              public panelsManager: PanelsManager) {}

  ngOnInit() {
    this.itemsDao.list.subscribe(items => {
      if (items) {
        this.subcategories = getCategoryGroup(items).subcategories;
      }
    });
  }
}
