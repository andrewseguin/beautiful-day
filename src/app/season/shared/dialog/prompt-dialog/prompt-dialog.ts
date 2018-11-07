import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
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

  onSaveSubject = new Subject<string|number>();

  constructor(private dialogRef: MatDialogRef<PromptDialog, PromptDialogResult>,
              @Inject(MAT_DIALOG_DATA) public data: PromptDialogData) {
    this.title = data.title;
    this.useTextArea = data.useTextArea;
    this.type = data.type;

    data.input.pipe(take(1)).subscribe(input => this.newInput.setValue(input));
  }

  onSave(): Observable<string|number> {
    return this.onSaveSubject.asObservable();
  }

  save() {
    this.dialogRef.close({
      value: this.newInput.value
    });
  }
}
