import {animate, state, style, transition, trigger, AnimationEvent} from '@angular/animations';
import {Component, EventEmitter, Input, Output} from '@angular/core';

export type SlidingPanelState = 'open' | 'closed';

@Component({
  selector: 'sliding-panel',
  templateUrl: './sliding-panel.component.html',
  styleUrls: ['./sliding-panel.component.scss'],
  animations: [
    trigger('state', [
      state('open', style({transform: 'translateX(0%)'})),
      state('void, close', style({transform: 'translateX(100%)'})),
      transition('* <=> *', [
        animate('250ms cubic-bezier(0.35, 0, 0.25, 1)')]
      ),
    ])
  ],
  host: {
    '[@state]': 'state',
    '(@state.done)': 'afterStateAnimation($event)',
    '[class.mat-elevation-z5]': 'true'
  }
})
export class SlidingPanelComponent {
  state: SlidingPanelState = 'closed';

  @Input() category: string;

  @Output() closed = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
    this.state = 'open';
  }

  afterStateAnimation(e: AnimationEvent) {
    if (e.toState == 'close') {
      this.closed.next();
    }
  }
}
