import {Component} from '@angular/core';
import {PromptDialogComponent} from '../shared/dialog/prompt-dialog/prompt-dialog.component';
import {FeedbackService} from '../../../service/feedback.service';
import {MatDialog} from '@angular/material';

@Component({
  styleUrls: ['help.component.scss'],
  templateUrl: 'help.component.html'
})
export class HelpComponent {
  constructor(private matDialog: MatDialog,
              private feedbackService: FeedbackService) {}

  sendFeedback(): void {
    const dialogRef = this.matDialog.open(PromptDialogComponent);
    dialogRef.componentInstance.title = 'Send Feedback';
    dialogRef.componentInstance.useTextArea = true;
    dialogRef.componentInstance.onSave().subscribe(text => {
      this.feedbackService.addFeedback('feedback', <string>text);
    });
  }

  reportIssue(): void {
    const dialogRef = this.matDialog.open(PromptDialogComponent);
    dialogRef.componentInstance.title = 'Report Issue';
    dialogRef.componentInstance.useTextArea = true;
    dialogRef.componentInstance.onSave().subscribe(text => {
      this.feedbackService.addFeedback('issue', <string>text);
    });
  }
}
