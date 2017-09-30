import {Injectable} from '@angular/core';
import {
  AngularFireDatabase,
  FirebaseListObservable,
  FirebaseObjectObservable
} from 'angularfire2/database';

import {Note} from '../model/note';
import {Observable, Subject} from 'rxjs';
import * as firebase from 'firebase';

@Injectable()
export class NotesService {

  constructor(private db: AngularFireDatabase) {}

  getProjectNotes(projectId: string): FirebaseListObservable<Note[]> {
    return this.db.list('notes', {
      query: {
        orderByChild: 'project',
        equalTo: projectId
      }
    });
  }

  getDefaultProjectNoteId(projectId: string): Observable<string> {
    return this.db.list('notes', {
      query: {
        orderByChild: 'project',
        equalTo: projectId,
        limitToFirst: 1
      }
    }).take(1).flatMap((notes: Note[]) => {
      if (notes.length > 0) { return Observable.from([notes[0].$key]); }

      // Create a new note and return the key.
      const newNoteSubject = new Subject<string>();
      this.addNote(projectId).then(response => newNoteSubject.next(response.key));
      return newNoteSubject.asObservable();
    });

  }

  getNote(id: string): FirebaseObjectObservable<Note> {
    return this.db.object(`notes/${id}`);
  }

  addNote(projectId: string): firebase.database.ThenableReference {
    return this.db.list('notes').push({
      title: 'My Note',
      text: '',
      project: projectId,
    });
  }

  update(id: string, update: any) {
    this.getNote(id).update(update);
  }

  delete(id) {
    this.db.list('notes').remove(id);
  }
}
