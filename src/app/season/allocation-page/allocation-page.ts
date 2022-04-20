import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Allocations } from '../services/allocations';
import { map } from 'rxjs/operators';

interface RequestAllocation {
  id: string;
  allocation: number;
  project: string;
  requested: number;
}

interface ItemAllocations {
  id: string;
  itemName: string;
  quantityOwned: number;
  remaining: number;
  requestAllocations: RequestAllocation[];
}

@Component({
  selector: 'allocation-page',
  templateUrl: 'allocation-page.html',
  styleUrls: ['allocation-page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllocationPage {
  trackByItemAllocations = (_i: number, o: ItemAllocations) => o.id;
  trackByRequestAllocation = (_i: number, o: RequestAllocation) => o.id;

  allocationsList = this.allocations.itemAllocations.pipe(
    map((itemAllocations) => {
      const list: ItemAllocations[] = [];
      itemAllocations.forEach((value) => list.push(value));
      list.sort((a, b) => (a.itemName < b.itemName ? -1 : 1));
      return list;
    }),
  );

  constructor(public allocations: Allocations) {}
}
