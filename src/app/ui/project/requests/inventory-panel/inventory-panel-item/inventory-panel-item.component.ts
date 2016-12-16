import {
  Component, OnInit, Input, EventEmitter, Output, animate, transition,
  style, state, trigger
} from '@angular/core';
import {Item} from '../../../../../model/item';

export type InventoryPanelItemState = 'collapsed' | 'expanded';

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
      state('collapsed', style({height: '48px'})),
      state('expanded', style({height: '*'})),
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
  ]
})
export class InventoryPanelItemComponent implements OnInit {
  state: InventoryPanelItemState = 'collapsed';

  @Input() item: Item;

  @Output() createRequest = new EventEmitter<Item>();

  constructor() { }

  ngOnInit() {
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
  }

}
