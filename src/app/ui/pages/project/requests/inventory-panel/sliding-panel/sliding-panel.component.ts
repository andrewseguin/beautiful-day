import {animate, state, style, transition, trigger} from '@angular/animations';
import {ItemsService} from '../../../../../../service/items.service';
import {Item} from '../../../../../../model/item';
import {Observable} from 'rxjs/Observable';
import {Component} from '@angular/core';

export type SlidingPanelState = 'open' | 'closed';

@Component({
  selector: 'sliding-panel',
  templateUrl: './sliding-panel.component.html',
  styleUrls: ['./sliding-panel.component.scss'],
  animations: [
    trigger('state', [
      state('open', style({transform: 'translateX(0%)'})),
      state('closed', style({transform: 'translateX(100%)'})),
      state('void', style({transform: 'translateX(100%)'})),
      transition('* <=> *', [
        animate('250ms cubic-bezier(0.35, 0, 0.25, 1)')]
      ),
    ])
  ],
  host: {
    '[@state]': 'state',
    '[class.mat-elevation-z5]': 'true'
  }
})
export class SlidingPanelComponent {
  itemsObservable: Observable<Item[]>;
  state: SlidingPanelState = 'closed';

  _category: string;
  set category(category: string) {
    this._category = category;
    this.itemsObservable = this.itemsService.getItemsWithCategory(category);
  }
  get category(): string { return this._category; }

  constructor(private itemsService: ItemsService) { }

  open() { this.state = 'open'; }
  close() { this.state = 'closed'; }
}
