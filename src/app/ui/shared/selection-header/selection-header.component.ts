import {Component, animate, style, transition, state, trigger} from '@angular/core';
import {RequestsService} from '../../../service/requests.service';
import {MdSnackBar, MdDialog} from '@angular/material';
import {ItemsService} from '../../../service/items.service';

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
    return this.requestsService.getSelectedRequests().size ||
      this.itemsService.getSelectedItems().size;
  }

  getSelectionType(): SelectionType {
    if (this.requestsService.getSelectedRequests().size) {
      return 'request';
    } else if (this.itemsService.getSelectedItems().size) {
      return 'item';
    }

    return null;
  }

  clearSelection() {
    this.requestsService.clearSelected();
    this.itemsService.clearSelected();
  }
}
