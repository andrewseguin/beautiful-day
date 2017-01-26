import {Component, OnInit, ViewChild, ElementRef} from "@angular/core";
import {RequestsService} from "../../../../service/requests.service";
import {MdDialogRef} from "@angular/material";
import {ProjectsService} from "../../../../service/projects.service";

@Component({
  selector: 'edit-dropoff',
  templateUrl: './edit-dropoff.component.html',
  styleUrls: ['./edit-dropoff.component.scss']
})
export class EditDropoffComponent implements OnInit {
  requestIds: Set<string>;
  project: string;
  dateNeeded: string;

  selectedDropoffLocation: string;
  dropoffLocations: Set<string>;
  newDropoff: string;

  @ViewChild('dateInput') dateInput: ElementRef;

  constructor(private dialogRef: MdDialogRef<EditDropoffComponent>,
              private projectsService: ProjectsService,
              private requestsService: RequestsService) { }

  ngOnInit() {
    this.dropoffLocations = new Set<string>();
    this.requestsService.getProjectRequests(this.project).subscribe(requests => {
      requests.forEach(request => {
        if (request.dropoff) { this.dropoffLocations.add(request.dropoff); }
      });
    });
  }

  setDateFromRequest(requestDate: string) {
    const date = new Date(requestDate);
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    this.dateNeeded = date.getFullYear()+"-"+(month)+"-"+(day) ;
  }

  close() {
    this.dialogRef.close();
  }

  canSave(): boolean {
    if (this.selectedDropoffLocation == 'new' && !this.newDropoff) {
      return false;
    }

    if (!this.selectedDropoffLocation) {
      return false;
    }

    return true;
  }

  save() {
    // The third-party date picker doesn't play nice with ngModel. Grab the value directly for now.
    this.dateNeeded = this.dateInput.nativeElement.value;

    if (!this.canSave()) { return }

    if (this.selectedDropoffLocation == 'new') {
      this.selectedDropoffLocation = this.newDropoff;
    }

    // Move the UTC date to user's time zone
    const date = new Date(this.dateNeeded);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());

    // Set all requests to the dropoff location and time
    this.requestIds.forEach(requestId => {
      this.requestsService.update(requestId, {
        dropoff: this.selectedDropoffLocation,
        date: date.getTime()
      });
    });

    // Store the setting to use as defaults for new requests
    this.projectsService.setLastDropoff(this.project,
      this.selectedDropoffLocation, date.getTime());

    this.close();
    this.requestsService.clearSelected();
  }
}
