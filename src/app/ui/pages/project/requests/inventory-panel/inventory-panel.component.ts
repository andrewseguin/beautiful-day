import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Item} from 'app/model/item';
import {Project} from 'app/model/project';
import {Observable} from 'rxjs/Observable';
import {PanelsService} from './panels.service';
import {ItemsDao} from 'app/service/dao';
import {getCategoryGroup} from 'app/utility/items-categorize';

@Component({
  selector: 'inventory-panel',
  templateUrl: './inventory-panel.component.html',
  styleUrls: ['./inventory-panel.component.scss'],
  providers: [PanelsService]
})
export class InventoryPanelComponent implements OnInit {
  subcategories: string[];
  project: Observable<Project>;
  items: Item[];

  search = '';

  @Output('closeSidenav') closeSidenav = new EventEmitter<void>();

  constructor(private itemsDao: ItemsDao,
              public panelsService: PanelsService) {}

  ngOnInit() {
    this.itemsDao.list.subscribe(items => {
      if (items) {
        this.subcategories = getCategoryGroup(items).subcategories;
      }
    });
  }
}
