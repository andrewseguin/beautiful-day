import { Component, OnInit } from '@angular/core';
import {RequestsService} from "../../../service/requests.service";
import {MdDialogRef} from "@angular/material";
import {ProjectsService} from "../../../service/projects.service";
import {Dropoff} from "../../../model/dropoff";

@Component({
  selector: 'edit-dropoff',
  templateUrl: 'edit-dropoff.component.html',
  styleUrls: ['edit-dropoff.component.scss']
})
export class EditDropoffComponent implements OnInit {
  requestIds: Set<string>;
  project: string;
  selectedDropoffLocation: string;
  dateNeeded: string;
  dropoffLocations: Dropoff[];

  constructor(private dialogRef: MdDialogRef<EditDropoffComponent>,
              private projectsService: ProjectsService,
              private requestService: RequestsService) { }

  ngOnInit() {
    this.projectsService.getDropoffLocations(this.project).subscribe(dropoffLocations => {
      console.log(dropoffLocations);
      this.dropoffLocations = dropoffLocations;
    })
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    console.log(this.selectedDropoffLocation);
    console.log(this.dateNeeded);

    // Move the UTC date to user's time zone
    const date = new Date(this.dateNeeded);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    console.log(date.getTime());

    this.requestIds.forEach(requestId => {
      this.requestService.update(requestId, {
        dropoff: this.selectedDropoffLocation,
        date: date.getTime()
      });
    });
    this.close();
  }
}
