import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {SeasonCollectionDao} from './season-collection-dao';
import {ActivatedSeason} from 'app/season/services/activated-season';
import {AngularFireAuth} from '@angular/fire/auth';
import {take} from 'rxjs/operators';
import {IdentifiedObject} from 'app/utility/list-dao';

export const APPROVAL_NEGATERS = new Set(['note', 'quantity', 'dropoff', 'date']);

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
  previouslyApproved?: Request;
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

  update(id: string, obj: Request) {
     this.get(id).pipe(take(1)).subscribe(request => {
       // Updating a request that has been approved should remove
       // approval if certain fields are changed and record the previous
       // value.
       if (request.isApproved || request.previouslyApproved) {
         const changedProperties = Object.keys(obj).filter(prop => {
           const hasNegator = APPROVAL_NEGATERS.has(prop);
           const isChanged = obj[prop] !== request[prop];
           const prevNotChanged = !request.previouslyApproved || !request.previouslyApproved[prop];
           return hasNegator && isChanged && prevNotChanged;
         });
         if (changedProperties.length) {
           obj.isApproved = false;
           obj.previouslyApproved = {};
           changedProperties.forEach(prop => {
             obj.previouslyApproved[prop] = request[prop];
           });
         }
       }

       // If approved, removed the previouslyApproved properties
       if (obj.isApproved || obj.isPurchased) {
         // remove changed props
         obj.previouslyApproved = null;
       }

       // If purchased, go ahead and set to approved
       if (obj.isPurchased) {
         obj.isApproved = true;
       }

       obj.dateModified = new Date().toISOString();
       super.update(id, obj);
     });
  }


}

