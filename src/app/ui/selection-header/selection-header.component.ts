import {Component, animate, style, transition, state, trigger} from '@angular/core';
import {RequestsService} from "../../service/requests.service";
import {MdSnackBar, MdDialog} from "@angular/material";
import {EditNoteComponent} from "../dialog/edit-note/edit-note.component";
import {EditDropoffComponent} from "../dialog/edit-dropoff/edit-dropoff.component";

@Component({
  selector: 'selection-header',
  templateUrl: './selection-header.component.html',
  styleUrls: ['./selection-header.component.scss'],
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

  constructor(private requestsService: RequestsService,
              private mdDialog: MdDialog,
              private snackBar: MdSnackBar) { }

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

  editNote() {
    const dialogRef = this.mdDialog.open(EditNoteComponent);

    const selectedRequests = this.requestsService.getSelectedRequests();
    dialogRef.componentInstance.requestIds = selectedRequests;
    if (selectedRequests.size == 1) {
      selectedRequests.forEach(requestKey => {
        this.requestsService.getRequest(requestKey).subscribe(request => {
          dialogRef.componentInstance.note = request.note;
        })
      });
    }
  }

  editDropoff() {
    const dialogRef = this.mdDialog.open(EditDropoffComponent);
    dialogRef.componentInstance.requestIds =
      this.requestsService.getSelectedRequests();

    const selectedRequests = this.requestsService.getSelectedRequests();
    dialogRef.componentInstance.requestIds = selectedRequests;
    const firstRequest = selectedRequests.values().next().value;
    this.requestsService.getRequest(firstRequest).subscribe(request => {
      if (selectedRequests.size == 1) {
        dialogRef.componentInstance.selectedDropoffLocation = request.dropoff;
        dialogRef.componentInstance.setDateFromRequest(request.date);
      }
      dialogRef.componentInstance.project = request.project;
    });
  }
}
