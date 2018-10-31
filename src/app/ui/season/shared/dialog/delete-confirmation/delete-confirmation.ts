import {Component} from '@angular/core';
import {Observable} from 'rxjs';
import {Request} from 'app/model';

export interface DeleteConfirmationData {
  requests: Observable<Request[]>;
}

@Component({
  templateUrl: 'delete-confirmation.html',
  styleUrls: ['delete-confirmation.scss'],
})
export class DeleteConfirmation {}
