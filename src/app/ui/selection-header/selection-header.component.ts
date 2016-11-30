import {Component, animate, style, transition, state, trigger} from '@angular/core';
import {RequestsService} from "../../service/requests.service";
import {MdSnackBar} from "@angular/material";

@Component({
  selector: 'selection-header',
  templateUrl: 'selection-header.component.html',
  styleUrls: ['selection-header.component.scss'],
  host: {
    '[style.display]': 'none',
    '[class.md-elevation-z1]': 'true',
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

  constructor(private requestsService: RequestsService, private snackBar: MdSnackBar) { }

  getSelectionState() {
    return this.getSelectionCount() > 0 ? 'selected' : 'none';
  }

  getSelectionCount() {
    return this.requestsService.getSelectedRequests().size;
  }

  clearRequests() {
    this.requestsService.clearSelected();
  }

  deleteRequests() {
    this.requestsService.getSelectedRequests().forEach(id => {
      this.requestsService.removeRequest(id);
    });
    this.snackBar.open(`Removed ${this.getSelectionCount()} requests`);
    this.clearRequests();
  }
}
