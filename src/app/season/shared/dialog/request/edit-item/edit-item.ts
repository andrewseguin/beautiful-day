import {ChangeDetectionStrategy, Component, ElementRef, Inject, ViewChild} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {combineLatest, Observable, Subject} from 'rxjs';
import {debounceTime, map} from 'rxjs/operators';
import {Item, ItemsDao, Request} from '../../../../dao';
import {getItemsMatchingQuery} from '../../../../utility/items-search';

export interface EditItemResult {
  item: string;
}

export interface EditItemData {
  request: Observable<Request>;
}

@Component({
  selector: 'prompt-dialog',
  templateUrl: 'edit-item.html',
  styleUrls: ['edit-item.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditItem {
  item = new FormControl(null, Validators.required);

  getItemName = (item: Item) => item && item.name;

  @ViewChild('input') input: ElementRef;

  options = combineLatest([this.itemsDao.list, this.item.valueChanges]).pipe(
    debounceTime(200),
    map(result => {
      const matchingItems = getItemsMatchingQuery(result[0], this.input.nativeElement.value);
      const itemsByCategory = new Map<string, Item[]>();

      for (const item of matchingItems) {
        const category = item.categories[0];
        if (!itemsByCategory.get(category)) {
          itemsByCategory.set(category, []);
        }

        itemsByCategory.get(category).push(item);
      }

      return Array.from(itemsByCategory.keys()).sort().map(category => {
        return {
          name: category,
          items: itemsByCategory.get(category)
        };
      });
    }));

  private destroyed = new Subject();

  constructor(private itemsDao: ItemsDao,
              private sanitizer: DomSanitizer,
              private dialogRef: MatDialogRef<EditItem, EditItemResult>,
              @Inject(MAT_DIALOG_DATA) public data: EditItemData) {
  }

  save() {
    this.dialogRef.close({item: this.item.value.id});
  }

  getSafeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
}
