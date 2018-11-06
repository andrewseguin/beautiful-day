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
  title = '';

  @Input() category: string;

  @Output() closed = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
    // Make microtask so that after initialized, the state changes and slides in
    setTimeout(() => this.open = true);

    const subcategories = this.category.split('>');
    this.title = subcategories[subcategories.length - 1];
  }

  close() {
    this.open = false;
    setTimeout(() => {
      this.closed.emit();
    }, 250); // Animation duration
  }
}
