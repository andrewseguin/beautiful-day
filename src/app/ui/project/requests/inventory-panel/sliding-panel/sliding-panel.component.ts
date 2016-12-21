import {Component, animate, style, transition, state, trigger} from "@angular/core";
import {ItemsService} from "../../../../../service/items.service";
import {FirebaseListObservable} from "angularfire2";
import {Item} from "../../../../../model/item";

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
    '[class.md-elevation-z5]': 'true'
  }
})
export class SlidingPanelComponent {
  itemsObservable: FirebaseListObservable<Item[]>;
  state: SlidingPanelState = 'closed';

  constructor(private itemsService: ItemsService) { }

  _category: string;
  set category(category: string) {
    this._category = category;
    this.itemsObservable = this.itemsService.getItemsWithCategory(category);
  }
  get category(): string { return this._category; }

  open() { this.state = 'open' }
  close() { this.state = 'closed' }
}
