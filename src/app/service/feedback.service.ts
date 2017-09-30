import {Injectable} from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import {Feedback} from '../model/feedback';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material';
import {APP_VERSION} from '../app.component';
import {AngularFireAuth} from 'angularfire2/auth';

@Injectable()
export class FeedbackService {

  constructor(private db: AngularFireDatabase,
              private mdSnackbar: MatSnackBar,
              private auth: AngularFireAuth) { }

  getAllFeedback(): FirebaseListObservable<Feedback[]> {
    return this.db.list('feedback');
  }

  addFeedback(feedback: string|number) {
    this.auth.authState.first().subscribe(auth => {
      if (!auth) { return; }
      this.db.list('feedback').push({
        type: 'feedback',
        user: auth.uid,
        text: feedback,
        dateAdded: new Date().getTime(),
        appVersion: APP_VERSION
      });
      this.showSnackbar('Feedback sent!');
    });
  }

  addIssue(issue: string|number) {
    this.auth.authState.first().subscribe(auth => {
      if (!auth) { return; }
      this.db.list('feedback').push({
        type: 'issue',
        user: auth.uid,
        text: issue,
        dateAdded: new Date().getTime(),
        appVersion: APP_VERSION
      });
      this.showSnackbar('Issue report sent.');
    });
  }

  showSnackbar(text: string) {
    const snackbarConfig = new MatSnackBarConfig();
    snackbarConfig.duration = 2000;
    this.mdSnackbar.open(text, null, snackbarConfig);
  }

  update(feedback: Feedback) {
    this.db.object(`feedback/${feedback.$key}`).update({
      type: feedback.type,
      user: feedback.user,
      text: feedback.text,
      reviewed: feedback.reviewed
    });
  }
}
