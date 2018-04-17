import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy} from '@angular/core';
import {FeedbackService} from 'app/service/feedback.service';
import {Feedback} from 'app/model/feedback';
import {UsersService} from 'app/service/users.service';
import {Subscription} from 'rxjs/Subscription';
import {User} from 'app/model/user';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedbackComponent implements OnDestroy {
  newFeedback = this.feedbackService.feedback.pipe(map(v => v.filter(f => !f.reviewed)));
  reviewedFeedback = this.feedbackService.feedback.pipe(map(v => v.filter(f => f.reviewed)));

  usersMap = new Map<string, User>();
  usersMapSubscription: Subscription;

  constructor(private feedbackService: FeedbackService,
              private changeDetectionRef: ChangeDetectorRef,
              public usersService: UsersService) {
    this.usersMapSubscription = this.usersService.usersMap.subscribe(v => {
      this.usersMap = v;
      this.changeDetectionRef.markForCheck();
    });
  }

  ngOnDestroy() {
    this.usersMapSubscription.unsubscribe();
  }

  setReviewed(feedback: Feedback) {
    this.feedbackService.update(feedback.$key, {reviewed: true});
  }
}
