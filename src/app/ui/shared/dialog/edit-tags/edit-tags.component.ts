import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {RequestsService} from 'app/service/requests.service';

@Component({
  selector: 'edit-tags',
  templateUrl: './edit-tags.component.html',
  styleUrls: ['./edit-tags.component.scss']
})
export class EditTagsComponent {
  commonTags: Set<string> = new Set();
  requestTags: Map<string, Set<string>> = new Map();

  _requestIds: string[];
  set requestIds(requestIds: string[]) {
    this._requestIds = requestIds;
    requestIds.forEach(requestId => {
      this.requestsService.get(requestId).subscribe(request => {
        const tags = new Set<string>(request.tags ? request.tags.split(',') : []);
        this.requestTags.set(request.$key, tags);
        this.updateCommonTags();
      });
    });
  }
  get requestIds(): string[] { return this._requestIds; }

  newTag = '';

  constructor(private dialogRef: MatDialogRef<EditTagsComponent>,
              private requestsService: RequestsService) {}

  close() {
    this.dialogRef.close();
  }

  save() {
    // If spaces exist (from mobile), then title case and remove spaces
    this.newTag = this.toTitleCase(this.newTag).replace(/\s+/g, '');

    if (this.newTag) {
      // Add a hash tag if there is none
      if (this.newTag.charAt(0) != '#') { this.newTag = '#' + this.newTag; }

      this.requestTags.forEach(tags => {
        tags.add(this.newTag);
      });
    }

    this.requestTags.forEach((tags, requestKey) => {
      this.requestsService.update(requestKey, {tags: Array.from(tags).join(',')});
    });

    this.close();
    this.requestsService.selection.clear();
  }

  removeTag(tag: string) {
    this.requestTags.forEach(tags => tags.delete(tag));
    this.updateCommonTags();
  }

  updateCommonTags() {
    // Initialize with the first set of tags to use as a base for intersection
    this.commonTags = this.requestTags.values().next().value;
    this.requestTags.forEach(tags => {
      // Save intersection from commonTags and these tags
      this.commonTags = new Set([...Array.from(this.commonTags)].filter(tag => tags.has(tag)));
    });
  }

  toTitleCase(str: string): string {
    return str.replace(/\w\S*/g,
        (txt) => (txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()));
  }
}
