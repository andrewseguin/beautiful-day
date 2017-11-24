import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ItemsService} from '../../../../../service/items.service';
import {Item} from '../../../../../model/item';
import {Project} from '../../../../../model/project';
import {SubheaderService} from '../../../../../service/subheader.service';
import {MediaQueryService} from '../../../../../service/media-query.service';
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
  subheaderVisibility = true;
  items: Item[];

  search = '';

  @Output('closeSidenav') closeSidenav = new EventEmitter<void>();

  constructor(private subheaderService: SubheaderService,
              private mediaQuery: MediaQueryService,
              private itemsService: ItemsService,
              public panelsService: PanelsService) {}

  ngOnInit() {
    this.itemsService.getCategoryGroup().subscribe(categoryGroup => {
      this.subcategories = categoryGroup.subcategories;
    });

    this.subheaderService.visibilitySubject.subscribe(visibility => {
      if (!this.mediaQuery.isMobile()) {
        this.subheaderVisibility = false;
      } else {
        this.subheaderVisibility = visibility;
      }
    });
  }
}
