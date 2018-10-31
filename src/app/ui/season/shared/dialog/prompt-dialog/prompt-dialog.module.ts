import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from 'app/material.module';
import {PromptDialog} from 'app/ui/season/shared/dialog/prompt-dialog/prompt-dialog';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  declarations: [PromptDialog],
  exports: [PromptDialog],
  entryComponents: [PromptDialog]
})
export class PromptDialogModule { }

