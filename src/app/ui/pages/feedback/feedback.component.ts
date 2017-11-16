import { Component, OnInit } from '@angular/core';
import {FeedbackService} from "../../../service/feedback.service";
import {Feedback} from "../../../model/feedback";
import {UsersService} from "../../../service/users.service";
import {User} from "../../../model/user";
import {Observable} from "rxjs";
import {HeaderService} from "../../../service/header.service";
import {transformSnapshotAction} from '../../../utility/snapshot-tranform';

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
    this.feedbackService.getAllFeedback().subscribe(allFeedback => {
      allFeedback.forEach(feedback => {
        if (!this.userMap.get(feedback.user)) {
          this.userMap.set(feedback.user, this.usersService.getByUid(feedback.user).snapshotChanges().map(transformSnapshotAction));
        }
      });

      this.newFeedback = allFeedback.filter(feedback => !feedback.reviewed);
      this.reviewedFeedback = allFeedback.filter(feedback => feedback.reviewed);
    });
  }

  setReviewed(feedback: Feedback) {
    feedback.reviewed = true;
    this.feedbackService.update(feedback);
  }
}
