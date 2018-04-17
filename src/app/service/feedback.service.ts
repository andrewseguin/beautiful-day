import {Injectable} from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import {Feedback} from '../model/feedback';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material';
import {AngularFireAuth} from 'angularfire2/auth';
import {Observable} from 'rxjs/Observable';
import {DaoService} from './dao-service';
import {first} from 'rxjs/operators';

@Injectable()
export class FeedbackService extends DaoService<Feedback> {
  feedback: Observable<Feedback[]>;

  constructor(db: AngularFireDatabase,
              private mdSnackbar: MatSnackBar,
              private auth: AngularFireAuth) {
    super(db, 'feedback');
    this.feedback = this.getKeyedListDao();
  }

  addFeedback(type: 'issue' | 'feedback', text: string) {
    this.auth.authState.pipe(first()).subscribe(auth => {
      if (!auth) { return; }

      const obj = {type, text,
        user: auth.uid,
        dateAdded: new Date().getTime(),
      };

      this.add(obj).then(() => {
        const message = type === 'feedback' ?
          'Feedback sent!' :
          'Issue report sent!';
        this.showSnackbar(message);
      });
    });

  }

  showSnackbar(text: string) {
    const snackbarConfig = new MatSnackBarConfig();
    snackbarConfig.duration = 2000;
    this.mdSnackbar.open(text, null, snackbarConfig);
  }
}
