import {Injectable} from '@angular/core';
import {AngularFireDatabase,} from 'angularfire2/database';

import {Note} from '../model/note';
import {Observable, Subject} from 'rxjs';
import * as firebase from 'firebase';
import {transformSnapshotAction, transformSnapshotActionList} from '../utility/snapshot-tranform';

@Injectable()
export class NotesService {

  constructor(private db: AngularFireDatabase) {}

  getProjectNotes(projectId: string): Observable<Note[]> {
    return this.db.list('notes', ref => ref.orderByChild('project').equalTo(projectId)).snapshotChanges().map(transformSnapshotActionList);
  }

  getDefaultProjectNoteId(projectId: string): Observable<string> {
    return this.db.list('notes', ref => ref.orderByChild('project').equalTo(projectId).limitToFirst(1))
      .snapshotChanges().map(transformSnapshotActionList)
      .take(1).flatMap((notes: Note[]) => {
        if (notes.length > 0) { return Observable.from([notes[0].$key]); }

        // Create a new note and return the key.
        const newNoteSubject = new Subject<string>();
        this.addNote(projectId).then(response => newNoteSubject.next(response.key));
        return newNoteSubject.asObservable();
      });

  }

  getNote(id: string): Observable<Note> {
    return this.db.object(`notes/${id}`).snapshotChanges().map(transformSnapshotAction);
  }

  addNote(projectId: string): firebase.database.ThenableReference {
    return this.db.list('notes').push({
      title: 'My Note',
      text: '',
      project: projectId,
    });
  }

  update(id: string, update: any) {
    this.db.object(`notes/${id}`).update(update);
  }

  delete(id) {
    this.db.list('notes').remove(id);
  }
}
