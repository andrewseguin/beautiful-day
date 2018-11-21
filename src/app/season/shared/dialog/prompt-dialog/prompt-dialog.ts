import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Observable} from 'rxjs/Observable';
import {take} from 'rxjs/operators';
import {FormControl, Validators} from '@angular/forms';

export interface PromptDialogResult {
  value: string | number;
}

export interface PromptDialogData {
  title?: string;
  input?: Observable<string|number>;
  useTextArea?: boolean;
  type?: 'text' | 'number';
  description?: string;
}

@Component({
  selector: 'prompt-dialog',
  templateUrl: 'prompt-dialog.html',
  styleUrls: ['prompt-dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PromptDialog {
  title = '';
  useTextArea: boolean;
  type: 'text' | 'number' = 'text';
  newInput = new FormControl('', Validators.required);
  input: any;
  description: string;

  constructor(private dialogRef: MatDialogRef<PromptDialog, PromptDialogResult>,
              private cd: ChangeDetectorRef,
              @Inject(MAT_DIALOG_DATA) public data: PromptDialogData) {
    this.title = data.title;
    this.useTextArea = data.useTextArea;
    this.type = data.type;
    this.description = data.description;

    data.input.pipe(take(1)).subscribe(input => {
      this.newInput.setValue(input);
      this.cd.markForCheck();
    });
  }

  save() {
    const value = this.type === 'number' ?
        Number(this.newInput.value) : this.newInput.value;
    this.dialogRef.close({value});
  }
}
