import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Observable} from 'rxjs';
import {Request} from 'app/model';

export interface EditTagsData {
  requests: Observable<Request[]>;
}

export interface EditTagsResult {
  tags: string[];
}

@Component({
  selector: 'edit-tags',
  templateUrl: 'edit-tags.html',
  styleUrls: ['edit-tags.scss']
})
export class EditTags {
  tags: string[] = [];

  tagTransform = (tag: string) => {
    if (tag.charAt(0) != '#') {
      tag = '#' + tag;
    }

    return tag;
  }

  constructor(private dialogRef: MatDialogRef<EditTags, EditTagsResult>,
              @Inject(MAT_DIALOG_DATA) public data: EditTagsData) {
    this.data.requests.subscribe(requests => {
      const firstTags = requests[0].tags || [];
      const allMatching = requests.every(request => {
        const strA = (request.tags || []).sort().toString().toLowerCase();
        const strB = firstTags.sort().toString().toLowerCase();
        return strA === strB;
      });

      this.tags = allMatching ? firstTags : [];
    });
  }

  save(tags: string[]) {
    tags = tags.sort();
    this.dialogRef.close({tags});
  }
}
