import {Injectable} from '@angular/core';
import {AngularFireDatabase,} from 'angularfire2/database';
import {Note} from '../model/note';
import {Observable, Subject} from 'rxjs';
import * as firebase from 'firebase';
import {DaoService} from './dao-service';

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
    return this.queryList(queryFn).take(1).flatMap((notes: Note[]) => {
      if (notes.length > 0) { return Observable.from([notes[0].$key]); }

      // Create a new note and return the key.
      const newNoteSubject = new Subject<string>();
      this.addNote(projectId).then(response => newNoteSubject.next(response.key));
      return newNoteSubject.asObservable();
    });
  }

  addNote(project: string): firebase.database.ThenableReference {
    return this.add({title: 'My Note', text: '', project: project});
  }
}
