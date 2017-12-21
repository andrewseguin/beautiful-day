import {NgModule} from '@angular/core';
import {FeedbackComponent} from './feedback.component';
import {CommonModule} from '@angular/common';
import {MaterialModule} from 'app/material.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
  ],
  declarations: [FeedbackComponent],
  exports: [FeedbackComponent],
})
export class FeedbackModule { }
