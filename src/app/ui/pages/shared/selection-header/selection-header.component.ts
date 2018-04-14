import {animate, Component, state, style, transition, trigger} from '@angular/core';
import {RequestsService} from 'app/service/requests.service';
import {ItemsService} from 'app/service/items.service';

export type SelectionType = 'request' | 'item';

@Component({
  selector: 'selection-header',
  templateUrl: './selection-header.component.html',
  styleUrls: ['./selection-header.component.scss'],
  host: {
    '[style.display]': 'none',
    '[class.mat-elevation-z1]': 'true',
    '[@state]': 'getSelectionState()'
  },
  animations: [
    trigger('state', [
      state('void, none', style({transform: 'translateY(-100%)'})),
      state('selected', style({transform: 'translateY(0%)'})),
      transition('void => selected, none <=> selected', [
        animate('350ms cubic-bezier(0.35, 0, 0.25, 1)')]
      ),
    ])
  ]
})
export class SelectionHeaderComponent {

  constructor(private requestsService: RequestsService,
              private itemsService: ItemsService) { }

  getSelectionState() {
    return this.getSelectionCount() > 0 ? 'selected' : 'none';
  }

  getSelectionCount() {
    return this.requestsService.selection.selected.length ||
      this.itemsService.selection.selected.length;
  }

  getSelectionType(): SelectionType {
    if (this.requestsService.selection.selected.length) {
      return 'request';
    } else if (this.itemsService.selection.selected.length) {
      return 'item';
    }

    return null;
  }

  clearSelection() {
    this.requestsService.selection.clear();
    this.itemsService.selection.clear();
  }
}
