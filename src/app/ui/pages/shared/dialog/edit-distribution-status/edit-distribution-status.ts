import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {Request} from 'app/model/request';
import {RequestsService} from 'app/service/requests.service';
import {take} from 'rxjs/operators';
import {combineLatest} from 'rxjs/observable/combineLatest';

@Component({
  selector: 'edit-distribution-status-dialog',
  templateUrl: 'edit-distribution-status.html',
  styleUrls: ['edit-distribution-status.scss']
})
export class EditDistributionStatusDialogComponent {
  requestIds: string[];
  isDistributed = true;
  distributionDate = new Date();

  constructor(private dialogRef: MatDialogRef<EditDistributionStatusDialogComponent>,
              private requestsService: RequestsService) {}

  ngOnInit() {
    const requestsFetch = this.requestIds.map(id => this.requestsService.get(id));
    combineLatest(requestsFetch).pipe(take(1)).subscribe(requests => {
      console.log(requests);
    });
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    this.requestIds.forEach(requestId => {
      const update: Request = {
        isDistributed: this.isDistributed,
        distributionDate: this.isDistributed ? this.distributionDate.getTime() : 0
      };

      this.requestsService.update(requestId, update);
    });

    this.close();
  }
}
