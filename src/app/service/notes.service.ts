import { Injectable } from '@angular/core';
import {FirebaseListObservable, FirebaseObjectObservable, AngularFireDatabase} from "angularfire2";

import {Note} from "../model/note";

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

  getDefaultProjectNoteId(projectId: string): FirebaseListObservable<Note> {
    return this.db.list('notes', {
      query: {
        orderByChild: 'project',
        equalTo: projectId,
        limitToFirst: 1
      }
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
