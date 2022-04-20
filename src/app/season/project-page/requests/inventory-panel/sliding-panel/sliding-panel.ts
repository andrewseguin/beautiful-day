import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';
import { map, takeUntil } from 'rxjs/operators';
import { getCategoryGroup } from 'app/utility/items-categorize';
import { Item, ItemsDao } from 'app/season/dao';
import { combineLatest, Observable, Subject } from 'rxjs';
import { PanelsManager } from 'app/season/project-page/requests/inventory-panel/panels-manager';
import { CdkScrollable } from '@angular/cdk/overlay';
import { Allocations } from '../../../../services/allocations';

@Component({
  selector: 'sliding-panel',
  templateUrl: 'sliding-panel.html',
  styleUrls: ['sliding-panel.scss'],
  host: {
    '[class.mat-elevation-z5]': 'true',
    '[class.open]': 'open',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlidingPanel {
  open = false;
  title = '';
  items: Observable<Item[]>;
  subcategories: Observable<string[]>;

  itemTrackBy = (_i, item: Item) => item.id;

  @Input() category: string;

  @Input() depth: number;

  @Input() project: string;

  constructor(
    private cd: ChangeDetectorRef,
    private panelsManager: PanelsManager,
    private allocations: Allocations,
    private itemsDao: ItemsDao,
  ) {}

  ngOnInit() {
    this.items = combineLatest([
      this.itemsDao.list,
      this.allocations.itemAllocations,
    ]).pipe(
      map(([items, itemAllocations]) => {
        if (items) {
          let categoryItems = getCategoryGroup(items, this.category).items;
          categoryItems = categoryItems.sort((a, b) => {
            const aRemaining = Math.max(
              itemAllocations.get(a.id)?.remaining || 0,
              0,
            );
            const bRemaining = Math.max(
              itemAllocations.get(b.id)?.remaining || 0,
              0,
            );
            return bRemaining - aRemaining;
          });
          return categoryItems;
        }
      }),
    );

    this.subcategories = this.itemsDao.list.pipe(
      map((items) => {
        if (items) {
          return getCategoryGroup(items, this.category).subcategories;
        }
      }),
    );

    // Make microtask so that after initialized, the state changes and slides in
    setTimeout(() => {
      this.open = true;
      this.cd.markForCheck();
    });

    const subcategories = this.category.split('>');
    this.title = subcategories[subcategories.length - 1];
  }

  openPanel(category: string) {
    this.panelsManager.openPanel(category, this.depth + 1);
  }

  close() {
    this.open = false;
    setTimeout(() => {
      this.panelsManager.closePanel(this.depth);
    }, 250); // Animation duration
  }
}
