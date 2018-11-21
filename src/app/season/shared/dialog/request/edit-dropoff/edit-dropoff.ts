import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ProjectsDao, Request, RequestsDao} from 'app/season/dao';
import {map, mergeMap, takeUntil} from 'rxjs/operators';
import {FormControl, Validators} from '@angular/forms';
import {Observable, of, Subject} from 'rxjs';

export interface EditDropoffData {
  requests: Observable<Request[]>;
}

export interface EditDropoffResult {
  project: string;
  dropoff: string;
  date: Date;
}

@Component({
  templateUrl: 'edit-dropoff.html',
  styleUrls: ['edit-dropoff.scss'],
  host: {
    '(keyup.Enter)': 'save()'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditDropoff implements OnInit {
  location = new FormControl('', Validators.required);
  date = new FormControl('', Validators.required);
  locationOptions: Observable<string[]>;

  private project: string;

  private destroyed = new Subject();

  constructor(private dialogRef: MatDialogRef<EditDropoff>,
              @Inject(MAT_DIALOG_DATA) public data: EditDropoffData,
              private projectsDao: ProjectsDao,
              private requestsDao: RequestsDao) { }

  ngOnInit() {
    this.data.requests.pipe(takeUntil(this.destroyed))
        .subscribe(requests => {
          this.setDropoff(requests);
          this.setDate(requests);
          this.getLocations(requests);
        });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  save() {
    if (!this.date.valid && !this.location.valid) {
      return;
    }

    this.dialogRef.close({
      project: this.project,
      dropoff: this.location.value,
      date: this.date.value,
    });
  }

  private setDropoff(requests: Request[]) {
    const firstDropoff = requests[0].dropoff;
    if (requests.every(r => r.dropoff === firstDropoff)) {
      this.location.setValue(firstDropoff);
    }
  }

  private setDate(requests: Request[]) {
    const firstDate = requests[0].date;
    if (requests.every(r => r.date === firstDate)) {
      this.date.setValue(new Date(firstDate));
    }
  }

  private getLocations(requests: Request[]): Observable<string[]> {
    this.project = requests[0].project;
    if (requests.every(r => r.project === this.project)) {
      return this.requestsDao.getByProject(this.project).pipe(
        map(requests => {
          const locations = new Set<string>();
          requests.forEach(r => locations.add(r.dropoff));
          return Array.from(locations);
        }));
    } else {
      return of([]);
    }
  }
}
