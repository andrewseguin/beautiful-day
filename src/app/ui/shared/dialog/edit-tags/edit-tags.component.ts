import { Component, OnInit } from '@angular/core';
import {MdDialogRef} from "@angular/material";
import {RequestsService} from "../../../../service/requests.service";

@Component({
  selector: 'edit-tags',
  templateUrl: './edit-tags.component.html',
  styleUrls: ['./edit-tags.component.scss']
})
export class EditTagsComponent {
  commonTags: Set<string> = new Set();
  requestTags: Map<string, Set<string>> = new Map();

  _requestIds: Set<string>;
  set requestIds(requestIds: Set<string>) {
    this._requestIds = requestIds;
    requestIds.forEach(requestId => {
      this.requestsService.getRequest(requestId).subscribe(request => {
        const tags = new Set(request.tags ? request.tags.split(',') : []);
        this.requestTags.set(request.$key, tags);
        this.updateCommonTags();
      });
    });
  }
  get requestIds(): Set<string> { return this._requestIds; }

  newTag: string = '';

  constructor(private dialogRef: MdDialogRef<EditTagsComponent>,
              private requestsService: RequestsService) {}

  close() {
    this.dialogRef.close();
  }

  save() {
    if (this.newTag) {
      this.requestTags.forEach(tags => {
        tags.add(this.newTag);
      });
    }

    this.requestTags.forEach((tags, requestKey) => {
      this.requestsService.update(requestKey, {tags: Array.from(tags).join(',')});
    });

    this.close();
    this.requestsService.clearSelected();
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

  handleNewTagKeypress(e: KeyboardEvent) {
    // Disallow spaces in tags
    if (e.keyCode == 32) { e.preventDefault() }
  }
}
