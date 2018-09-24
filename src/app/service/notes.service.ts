import {Injectable} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {Note} from '../model/note';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import * as firebase from 'firebase';
import {DaoService} from './dao-service';
import {from} from 'rxjs/observable/from';
import {mergeMap, take} from 'rxjs/operators';

@Injectable()
export class NotesService extends DaoService<Note> {

  constructor(protected db: AngularFireDatabase) {
    super(db, 'notes');
  }

  getProjectNotes(projectId: string): Observable<Note[]> {
    const queryFn = ref => ref.orderByChild('project').equalTo(projectId);
    return this.queryList(queryFn);
  }

  getDefaultProjectNoteId(projectId: string): Observable<string> {
    const queryFn = ref => ref.orderByChild('project').equalTo(projectId).limitToFirst(1);
    return this.queryList(queryFn).pipe(
      take(1),
      mergeMap((notes: Note[]) => {
        if (notes.length > 0) { return from([notes[0].$key]); }

        // Create a new note and return the key.
        const newNoteSubject = new Subject<string>();
        this.addNote(projectId).then(response => newNoteSubject.next(response.key));
        return newNoteSubject.asObservable();
      }));
  }

  addNote(project: string): firebase.database.ThenableReference {
    return this.add({title: 'My Note', text: '', project: project});
  }
}
