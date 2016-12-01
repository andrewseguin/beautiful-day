import { Component, OnInit } from '@angular/core';
import {RequestsService} from "../../../service/requests.service";
import {MdDialogRef} from "@angular/material";
import {ProjectsService} from "../../../service/projects.service";

@Component({
  selector: 'edit-dropoff',
  templateUrl: 'edit-dropoff.component.html',
  styleUrls: ['edit-dropoff.component.scss']
})
export class EditDropoffComponent implements OnInit {
  requestIds: Set<string>;
  project: string;
  dateNeeded: string = '2001-01-01';

  selectedDropoffLocation: string;
  dropoffLocations: Set<string>;
  newDropoff: string;

  constructor(private dialogRef: MdDialogRef<EditDropoffComponent>,
              private projectsService: ProjectsService,
              private requestService: RequestsService) { }

  ngOnInit() {
    this.dropoffLocations = new Set<string>();
    this.requestService.getProjectRequests(this.project).subscribe(requests => {
      requests.forEach(request => this.dropoffLocations.add(request.dropoff));
    });
  }

  close() {
    this.dialogRef.close();
  }

  canSave(): boolean {
    if (!this.dateNeeded) {
      return false;
    }

    if (this.selectedDropoffLocation == 'new' && !this.newDropoff) {
      return false;
    }

    if (!this.selectedDropoffLocation) {
      return false;
    }

    return true;
  }

  save() {
    if (this.selectedDropoffLocation == 'new') {
      this.selectedDropoffLocation = this.newDropoff;
    }

    // Move the UTC date to user's time zone
    const date = new Date(this.dateNeeded);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());

    this.requestIds.forEach(requestId => {
      this.requestService.update(requestId, {
        dropoff: this.selectedDropoffLocation,
        date: date.getTime()
      });
    });

    // Store the setting to use as defaults for new requests
    this.projectsService.setLastDropoff(this.project,
      this.selectedDropoffLocation, date.getTime());

    this.close();
  }
}
