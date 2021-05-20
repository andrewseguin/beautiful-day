import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  ViewChild
} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {Item} from 'app/season/dao';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {importItemsFromTsv} from '../../../../utility/inventory-conversion';

@Component({
  styleUrls: ['import-from-file.scss'],
  templateUrl: 'import-from-file.html',
  host: {
    '(keyup.Enter)': 'save()'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImportFromFile {
  items;

  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;

  constructor(public dialogRef: MatDialogRef<ImportFromFile>,
              private cd: ChangeDetectorRef,
              private snackBar: MatSnackBar) { }

  importFile(fileList: FileList) {
    const file = fileList[0];

    const reader = new FileReader();
    reader.onload = e => {
      this.items = this.extractItems(e.target['result'] as string);
      this.cd.markForCheck();
    };
    reader.readAsText(file);
  }

  extractItems(tsvFileData: string): Item[] | null {
    try {
      return importItemsFromTsv(tsvFileData);
    } catch (error: any) {
      if (error as Error) {
        this.snackBar.open(error, null, {duration: 2000});
        this.dialogRef.close();
        return null;
      }
    }
  }

  save() {
    if (!this.items) {
      return;
    }

    this.dialogRef.close(this.items);
  }
}
