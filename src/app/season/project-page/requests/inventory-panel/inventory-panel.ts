import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output
} from '@angular/core';
import {PanelsManager} from './panels-manager';
import {Item, ItemsDao} from 'app/season/dao';
import {getCategoryGroup} from 'app/utility/items-categorize';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'inventory-panel',
  templateUrl: 'inventory-panel.html',
  styleUrls: ['inventory-panel.scss'],
  providers: [PanelsManager],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InventoryPanel implements OnInit {
  subcategories: string[];
  items: Item[];

  search = '';

  

  @Output('closeSidenav') closeSidenav = new EventEmitter<void>();

  private destroyed = new Subject();

  constructor(private itemsDao: ItemsDao,
              private cd: ChangeDetectorRef,
              public panelsManager: PanelsManager) {}

  ngOnInit() {
    this.itemsDao.list.pipe(takeUntil(this.destroyed)).subscribe(items => {
      if (items) {
        this.subcategories = getCategoryGroup(items).subcategories;
        this.cd.markForCheck();
      }
    });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
