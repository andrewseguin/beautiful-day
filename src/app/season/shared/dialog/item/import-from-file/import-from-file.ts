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

enum COLUMNS {
  NAME, CATEGORIES, URL, COST, HIDDEN, KEYWORDS, QUANTITY
}

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
    const itemRows = tsvFileData.split('\n');

    const headerRow = itemRows.shift();
    const error = areColumnsInvalid(headerRow.split('\t'));
    if (error) {
      this.snackBar.open(error, null, {duration: 2000});
      return null;
    }

    return itemRows.map(itemRow => {
      const itemInfo = itemRow.split('\t');

      let categories = itemInfo[COLUMNS.CATEGORIES].split(',');
      let name = itemInfo[COLUMNS.NAME];
      let hidden = !!itemInfo[COLUMNS.HIDDEN];
      let url = itemInfo[COLUMNS.URL] || '';
      let cost: number = itemInfo[COLUMNS.COST] ?
        +(itemInfo[COLUMNS.COST].replace('$', '').replace(',', '')) :
        0;
      let keywords = itemInfo[COLUMNS.KEYWORDS] || '';
      let quantityOwned = Number(itemInfo[COLUMNS.QUANTITY] || 0);

      return {name, categories, url, cost, hidden, keywords, quantityOwned};
    });
  }

  save() {
    if (!this.items) {
      return;
    }

    this.dialogRef.close(this.items);
  }
}

function areColumnsInvalid(row: string[]): string | null {
  const checks = [
    {column: COLUMNS.NAME, expected: 'Name'},
    {column: COLUMNS.CATEGORIES, expected: 'Categories'},
    {column: COLUMNS.URL, expected: 'Url'},
    {column: COLUMNS.COST, expected: 'Cost'},
    {column: COLUMNS.HIDDEN, expected: 'Hidden'},
    {column: COLUMNS.KEYWORDS, expected: 'Keywords'},
    {column: COLUMNS.QUANTITY, expected: 'Quantity'},
  ];

  let error = null;
  checks.some(check => {
    const actual = row[check.column];
    if (actual.toLowerCase() !== check.expected.toLowerCase()) {
      error = `Column was "${actual}" but expected "${check.expected}"`;
    }
    return !!error;
  });

  return error;
}
