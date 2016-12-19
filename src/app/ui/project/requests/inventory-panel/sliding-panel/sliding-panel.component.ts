import {
  Component, OnInit, Input, animate, style, transition, state, trigger,
  Output, EventEmitter
} from '@angular/core';
import {CategoryGroup} from "../../../../../service/items.service";
import {Item} from "../../../../../model/item";
import {MdDialog} from "@angular/material";
import {EditItemComponent} from "../../../../dialog/edit-item/edit-item.component";
import {CreateRequestEvent} from "../inventory-panel-item/inventory-panel-item.component";
import {setInterval} from "timers";

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
export class SlidingPanelComponent implements OnInit {

  _group: CategoryGroup;
  set group(g: CategoryGroup) {
    if (this._group == g) { return; }

    this._group = g;
    this.itemsToShow = 0;
    this.loadingValue = 0;
    const loadingIncrementer = window.setInterval(() => {
      const clear = () => { window.clearInterval(loadingIncrementer); };
      if (this._group != g) { clear(); }

      this.loadingValue += Math.random() * 10;
      if (this.loadingValue >= 100) {
        clear();
        this.itemsToShow = 10;
      }
    }, 50);
  }
  get group(): CategoryGroup { return this._group; }

  state: SlidingPanelState = 'closed';
  itemsToShow: number = 0;
  loadingValue: number = 0;

  constructor(private mdDialog: MdDialog) { }

  ngOnInit() {
    const loadingIncrementer = window.setInterval(() => {
      this.loadingValue += 10;
      if (this.loadingValue >= 100) {
        window.clearInterval(loadingIncrementer);
      }
    }, 1000);
  }

  open() {
    this.state = 'open';
  }

  close() {
    this.state = 'closed'
  }

  createItem() {
    const dialogRef = this.mdDialog.open(EditItemComponent);
    dialogRef.componentInstance.item = {category: this.group.category};
    dialogRef.componentInstance.mode = 'new';
    dialogRef.componentInstance.disableCategory = true;
  }

  itemTrackBy(i: number, item: Item) {
    return item.$key;
  }
}
