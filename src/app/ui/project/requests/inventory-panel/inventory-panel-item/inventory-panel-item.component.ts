import {
  Component, OnInit, Input, EventEmitter, Output, animate, transition,
  style, state, trigger, ChangeDetectionStrategy
} from '@angular/core';
import {Item} from '../../../../../model/item';

export type InventoryPanelItemState = 'collapsed' | 'expanded';

export interface CreateRequestEvent {
  item: Item;
  quantity: number;
}

@Component({
  selector: 'inventory-panel-item',
  templateUrl: './inventory-panel-item.component.html',
  styleUrls: ['./inventory-panel-item.component.scss'],
  host: {
    'md-ripple': 'true',
    '[class.md-elevation-z1]': "state == 'collapsed'",
    '[class.md-elevation-z10]': "state == 'expanded'",
    '[@size]': 'state',
  },
  animations: [
    trigger('size', [
      state('collapsed', style({height: '48px', margin: '0 8px'})),
      state('expanded', style({height: '*', margin: '16px 8px'})),
      transition('collapsed <=> expanded', [
        animate('350ms cubic-bezier(0.35, 0, 0.25, 1)')
      ]),
    ]),
    trigger('arrow', [
      state('collapsed', style({transform: 'rotateX(0deg)'})),
      state('expanded', style({transform: 'rotateX(180deg)'})),
      transition('collapsed <=> expanded', [
        animate('350ms cubic-bezier(0.35, 0, 0.25, 1)')
      ]),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InventoryPanelItemComponent implements OnInit {
  state: InventoryPanelItemState = 'collapsed';
  requestQuantity: number = 1;
  requested: boolean;

  @Input() item: Item;

  @Output() createRequest = new EventEmitter<CreateRequestEvent>();

  constructor() { }

  ngOnInit() { }

  ngOnChanges() {
    console.log('Item changes');
  }

  getItemName() {
    let name = this.item.name;
    if (this.item.type) {
      name += ` - ${this.item.type}`;
    }

    return name;
  }

  toggleState() {
    this.state = this.state == 'collapsed' ? 'expanded' : 'collapsed';
    this.requested = false;
  }

  request() {
    this.createRequest.emit({item: this.item, quantity: this.requestQuantity});
    this.requestQuantity = 1;
    this.requested = true;
  }

}
