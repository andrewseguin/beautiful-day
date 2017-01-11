import { Component, OnInit } from '@angular/core';
import {FeedbackService} from "../../../service/feedback.service";
import {Feedback} from "../../../model/feedback";
import {UsersService} from "../../../service/users.service";
import {User} from "../../../model/user";
import {Observable} from "rxjs";
import {HeaderService} from "../../../service/header.service";

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {
  feedbacks: Feedback[];
  userMap = new Map<string, Observable<User>>();

  constructor(private feedbackService: FeedbackService,
              private headerService: HeaderService,
              private usersService: UsersService) { }

  ngOnInit() {
    this.headerService.title = 'Feedback';
    this.feedbackService.getFeedback().subscribe(feedbacks => {
      this.feedbacks = feedbacks;
      this.feedbacks.forEach(feedback => {
        if (!this.userMap.get(feedback.user)) {
          this.userMap.set(feedback.user, this.usersService.getByUid(feedback.user));
        }
      })
    });
  }
}
