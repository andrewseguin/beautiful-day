import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Observable, Subject} from 'rxjs';
import {Request} from 'app/season/dao';
import {takeUntil} from 'rxjs/operators';

export interface EditTagsData {
  requests: Observable<Request[]>;
}

export interface EditTagsResult {
  tags: string[];
}

@Component({
  templateUrl: 'edit-tags.html',
  styleUrls: ['edit-tags.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditTags {
  tags: string[] = [];

  tagTransform = (tag: string) => {
    if (tag.charAt(0) != '#') {
      tag = '#' + tag;
    }

    return tag;
  }

  private destroyed = new Subject();

  constructor(private dialogRef: MatDialogRef<EditTags, EditTagsResult>,
              @Inject(MAT_DIALOG_DATA) public data: EditTagsData) {
    this.data.requests.pipe(takeUntil(this.destroyed)).subscribe(requests => {
      const firstTags = requests[0].tags || [];
      const allMatching = requests.every(request => {
        const strA = (request.tags || []).sort().toString().toLowerCase();
        const strB = firstTags.sort().toString().toLowerCase();
        return strA === strB;
      });

      this.tags = allMatching ? firstTags : [];
    });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  save(tags: string[]) {
    tags = tags.sort();
    this.dialogRef.close({tags});
  }
}
