import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {SeasonCollectionDao} from './season-collection-dao';
import {ActivatedSeason} from 'app/season/services/activated-season';
import {AngularFireAuth} from '@angular/fire/auth';
import {take} from 'rxjs/operators';
import * as firebase from 'firebase/app';

export const APPROVAL_NEGATERS = new Set(['note', 'quantity', 'dropoff', 'date']);

export interface PrevApproved {
  note?: string;
  quantity?: number;
  dropoff?: string;
  date?: string;
}

export interface Request {
  id?: string;
  project?: string;
  item?: string;
  dropoff?: string;
  quantity?: number;
  note?: string;
  date?: string;
  tags?: string[];
  purchaser?: string;
  isPurchased?: boolean;
  isApproved?: boolean;
  allocation?: number;
  distributionDate?: string;
  isDistributed?: boolean;
  costAdjustment?: number;
  costAdjustmentReason?: string;
  prevApproved?: PrevApproved;
  dateCreated?: string;
  dateModified?: string;
}

@Injectable()
export class RequestsDao extends SeasonCollectionDao<Request> {
  constructor(afs: AngularFirestore, afAuth: AngularFireAuth, activatedSeason: ActivatedSeason) {
    super(afs, afAuth, activatedSeason, 'requests');
  }

  getByProject(projectId: string): Observable<Request[]> {
    const queryFn = ref => ref.where('project', '==', projectId);
    return this.afs.collection(this.path, queryFn).valueChanges();
  }

  update(id: string, update: Request): Promise<void>;
  update(id: string[], update: Request): Promise<any[]>;
  update(idOrIds: string | string[], update: Request): Promise<void> | Promise<any[]> {
    if (idOrIds instanceof Array) {
      return Promise.all([Promise.reject('Batching requests is not supported yet.')]);
    }

    const id = idOrIds;
    return new Promise<void>(resolve => {
      this.get(id).pipe(take(1)).subscribe(request => {
        // If purchased, go ahead and set to approved
        if (update.isPurchased) {
          update.isApproved = true;
        }

        // If it is or was approved, save any previously approved
        // properties if the update contains changes to them.
        if (request.isApproved || request.prevApproved) {
          saveChangedApprovedProperties(update, request);
        }

        // If approved, removed the prevApproved properties
        if (update.isApproved) {
          update.prevApproved = null;
        }

        super.update(id, update).then(() => resolve());
      });
    });
  }
}

function saveChangedApprovedProperties(update: Request, request: Request) {
  update.prevApproved = {...request.prevApproved};

  // Capture changes in the update that were approved and not previously changed
  const changedApprovedProperties = Object.keys(update).filter(prop => {
    const hasNegator = APPROVAL_NEGATERS.has(prop);
    const isChanged = update[prop] !== request[prop];
    const prevNotChanged =
      !request.prevApproved || !request.prevApproved.hasOwnProperty(prop);
    return hasNegator && isChanged && prevNotChanged;
  });

  // Move original properties to prevApproved
  if (changedApprovedProperties.length) {
    update.isApproved = false;
    changedApprovedProperties.forEach(prop => {
      update.prevApproved[prop] = request[prop] || '';
    });
  }

  // Remove any prevApproved properties that match the update
  // E.g. update has quantity 2 and previously approved quantity was 2
  APPROVAL_NEGATERS.forEach(prop => {
    if (update.prevApproved[prop] === update[prop]) {
      delete update.prevApproved[prop];
    }
  });

  // Return request to approved if it matches its values again.
  if (Object.keys(update.prevApproved).length === 0) {
    update.isApproved = true;
    update.prevApproved = null;
  }
}
