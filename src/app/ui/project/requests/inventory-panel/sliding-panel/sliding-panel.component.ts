import {Component, animate, style, transition, state, trigger} from "@angular/core";
import {CategoryGroup} from "../../../../../service/items.service";

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
  group: CategoryGroup;
  state: SlidingPanelState = 'closed';

  constructor() { }

  open() {
    this.state = 'open';
  }

  close() {
    this.state = 'closed'
  }
}
