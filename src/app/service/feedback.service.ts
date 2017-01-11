import {Injectable} from "@angular/core";
import {AngularFireDatabase, AngularFireAuth, FirebaseListObservable} from "angularfire2";
import {Feedback} from "../model/feedback";
import {MdSnackBar, MdSnackBarConfig} from "@angular/material";

@Injectable()
export class FeedbackService {

  constructor(private db: AngularFireDatabase,
              private mdSnackbar: MdSnackBar,
              private auth: AngularFireAuth) { }

  getFeedback(): FirebaseListObservable<Feedback[]> {
    return this.db.list('feedback');
  }

  addFeedback(feedback: string) {
    this.auth.subscribe(auth => {
      if (!auth) { return; }
      this.db.list('feedback').push({
        type: 'feedback',
        user: auth.uid,
        text: feedback
      });
      this.showSnackbar('Feedback sent!');
    });
  }

  addIssue(issue: string) {
    this.auth.subscribe(auth => {
      if (!auth) { return; }
      this.db.list('feedback').push({
        type: 'issue',
        user: auth.uid,
        text: issue
      });
      this.showSnackbar('Issue report sent.');
    });
  }

  showSnackbar(text: string) {
    const snackbarConfig = new MdSnackBarConfig();
    snackbarConfig.duration = 2000;
    this.mdSnackbar.open(text, null, snackbarConfig);
  }
}
