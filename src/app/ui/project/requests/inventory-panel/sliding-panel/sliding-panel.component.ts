import {
  Component, OnInit, Input, animate, style, transition, state, trigger,
  Output, EventEmitter
} from '@angular/core';
import {CategoryGroup} from "../../../../../service/items.service";
import {Item} from "../../../../../model/item";
import {MdDialog} from "@angular/material";
import {EditItemComponent} from "../../../../dialog/edit-item/edit-item.component";
import {CreateRequestEvent} from "../inventory-panel-item/inventory-panel-item.component";

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
  group: CategoryGroup;
  state: SlidingPanelState = 'closed';
  page: number;

  @Output() createRequest = new EventEmitter<CreateRequestEvent>();

  constructor(private mdDialog: MdDialog) { }

  ngOnInit() {}

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
}
