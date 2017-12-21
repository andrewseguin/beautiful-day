import {Component, OnInit} from '@angular/core';
import {FeedbackService} from 'app/service/feedback.service';
import {Feedback} from 'app/model/feedback';
import {UsersService} from 'app/service/users.service';
import {User} from 'app/model/user';
import {Observable} from 'rxjs/Observable';
import {HeaderService} from 'app/service/header.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {
  newFeedback: Feedback[];
  reviewedFeedback: Feedback[];
  userMap = new Map<string, Observable<User>>();

  constructor(private feedbackService: FeedbackService,
              private headerService: HeaderService,
              private usersService: UsersService) { }

  ngOnInit() {
    this.headerService.title = 'Feedback';
    this.feedbackService.feedback.subscribe(allFeedback => {
      allFeedback.forEach(feedback => {
        if (!this.userMap.get(feedback.user)) {
          this.userMap.set(feedback.user, this.usersService.get(feedback.user));
        }
      });

      this.newFeedback = allFeedback.filter(feedback => !feedback.reviewed);
      this.reviewedFeedback = allFeedback.filter(feedback => feedback.reviewed);
    });
  }

  setReviewed(feedback: Feedback) {
    this.feedbackService.update(feedback.$key, {reviewed: true});
  }
}
