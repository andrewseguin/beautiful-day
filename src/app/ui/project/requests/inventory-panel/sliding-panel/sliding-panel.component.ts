import {Component, OnInit, Input, animate, style, transition, state, trigger} from '@angular/core';
import {CategoryGroup} from "../../../../../service/items.service";

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
        animate('350ms cubic-bezier(0.35, 0, 0.25, 1)')]
      ),
    ])
  ],
  host: {
    '[@state]': 'state',
    '[class.md-elevation-z5]': 'true'
  }
})
export class SlidingPanelComponent implements OnInit {
  state: string;

  _group: CategoryGroup;
  @Input('group') set group(group: CategoryGroup) {
    this._group = group;
    this.state = !!group ? 'open' : 'closed';
  }
  get group(): CategoryGroup { return this._group; }

  constructor() { }

  ngOnInit() {
  }

}
