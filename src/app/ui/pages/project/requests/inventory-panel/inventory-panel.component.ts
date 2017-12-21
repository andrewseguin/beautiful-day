import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ItemsService} from 'app/service/items.service';
import {Item} from 'app/model/item';
import {Project} from 'app/model/project';
import {SubheaderService} from 'app/service/subheader.service';
import {MediaQueryService} from 'app/service/media-query.service';
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
