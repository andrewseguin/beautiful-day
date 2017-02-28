import {Component} from "@angular/core";
import {MdDialogRef} from "@angular/material";
import {Subject, Observable} from "rxjs";

@Component({
  selector: 'prompt-dialog',
  templateUrl: './prompt-dialog.html',
  styleUrls: ['./prompt-dialog.scss']
})
export class PromptDialogComponent {
  title = '';
  input: string|number = '';
  useTextArea: boolean;
  type = 'text';

  onSaveSubject = new Subject<string|number>();

  constructor(private dialogRef: MdDialogRef<PromptDialogComponent>) {}

  onSave(): Observable<string> {
    return this.onSaveSubject.asObservable();
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    this.onSaveSubject.next(this.input);
    this.close();
  }
}
