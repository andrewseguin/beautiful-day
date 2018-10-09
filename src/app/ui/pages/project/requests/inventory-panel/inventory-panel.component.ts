import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ItemsService} from 'app/service/items.service';
import {Item} from 'app/model/item';
import {Project} from 'app/model/project';
import {Observable} from 'rxjs/Observable';
import {PanelsService} from './panels.service';

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

  constructor(private itemsService: ItemsService,
              public panelsService: PanelsService) {}

  ngOnInit() {
    this.itemsService.getCategoryGroup().subscribe(categoryGroup => {
      this.subcategories = categoryGroup.subcategories;
    });
  }
}
