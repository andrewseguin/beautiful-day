import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'sliding-panel',
  templateUrl: 'sliding-panel.html',
  styleUrls: ['sliding-panel.scss'],
  host: {
    '[class.mat-elevation-z5]': 'true',
    '[class.open]': `open`,
  }
})
export class SlidingPanel {
  open = false;

  @Input() category: string;

  @Output() closed = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
    // Make microtask so that after initialized, the state changes and slides in
    setTimeout(() => this.open = true);
  }

  close() {
    this.open = false;
    setTimeout(() => {
      this.closed.emit();
    }, 250); // Animation duration
  }
}
