import {Injectable, OnDestroy} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {Feedback} from '../model/feedback';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material';
import {AngularFireAuth} from '@angular/fire/auth';
import {DaoService} from './dao-service';
import {first, takeUntil} from 'rxjs/operators';
import {BehaviorSubject, Subject} from 'rxjs';

@Injectable()
export class FeedbackService extends DaoService<Feedback> implements OnDestroy {
  feedback = new BehaviorSubject<Feedback[]>([]);

  private destroyed = new Subject();

  constructor(db: AngularFireDatabase,
              private snackBar: MatSnackBar,
              private auth: AngularFireAuth) {
    super(db, 'feedback');
    this.getKeyedListDao().pipe(
        takeUntil(this.destroyed))
        .subscribe(feedback => {
          this.feedback.next(feedback);
        });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
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

  private showSnackbar(text: string) {
    const snackbarConfig = new MatSnackBarConfig();
    snackbarConfig.duration = 2000;
    this.snackBar.open(text, null, snackbarConfig);
  }
}
