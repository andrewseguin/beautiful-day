import {ChangeDetectionStrategy, Component} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {Selection} from 'app/season/services';

export type SelectionType = 'request' | 'item';

@Component({
  selector: 'selection-header',
  templateUrl: 'selection-header.html',
  styleUrls: ['selection-header.scss'],
  host: {
    '[style.display]': 'none',
    '[class.mat-elevation-z1]': 'true',
    '[@state]': 'getSelectionState()'
  },
  animations: [
    trigger('state', [
      state('void, none', style({transform: 'translateY(-110%)'})),
      state('selected', style({transform: 'translateY(0%)'})),
      transition('void => selected, none <=> selected', [
        animate('350ms cubic-bezier(0.35, 0, 0.25, 1)')]
      ),
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectionHeader {
  constructor(private selection: Selection) { }

  getSelectionState() {
    return this.getSelectionCount() > 0 ? 'selected' : 'none';
  }

  getSelectionCount() {
    return this.selection.requests.selected.length ||
      this.selection.items.selected.length;
  }

  getSelectionType(): SelectionType {
    if (this.selection.requests.selected.length) {
      return 'request';
    } else if (this.selection.items.selected.length) {
      return 'item';
    }

    return null;
  }

  clearSelection() {
    this.selection.requests.clear();
    this.selection.items.clear();
  }
}
