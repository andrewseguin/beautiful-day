import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import {MatDialog} from '@angular/material';
import {Item, Request} from 'app/model';
import {EditItem} from 'app/ui/season/shared/dialog/edit-item/edit-item';
import {Accounting, getRequestCost} from 'app/ui/season/services/accounting';
import {RequestsRenderer} from 'app/ui/season/shared/requests-list/render/requests-renderer';
import {Permissions} from 'app/ui/season/services/permissions';
import {Subject} from 'rxjs';
import {take, takeUntil} from 'rxjs/operators';
import {ProjectsDao, RequestsDao} from 'app/ui/season/dao';
import {Selection} from 'app/ui/season/services';
import {RequestDialog} from 'app/ui/season/shared/dialog/request/request-dialog';

@Component({
  selector: 'request',
  templateUrl: 'request-view.html',
  styleUrls: ['request-view.scss'],
  host: {
    '[style.pointer-events]': "canEdit ? '' : 'none'"
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestView implements OnInit {
  private destroyed = new Subject();

  displayState = 'hidden';

  @Input() request: Request;

  @Input() item: Item;

  @Input() isReporting: boolean;

  canEdit: boolean;

  @Input() set printMode(v) {
    if (v) {
      this.displayState = 'visible';
      this.cd.markForCheck();
    }
  }

  @ViewChild('quantityInput') quantityInput: ElementRef;

  constructor(private cd: ChangeDetectorRef,
              public requestsRenderer: RequestsRenderer,
              private mdDialog: MatDialog,
              private elementRef: ElementRef,
              private accounting: Accounting,
              private requestsDao: RequestsDao,
              private selection: Selection,
              private projectsDao: ProjectsDao,
              private requestDialog: RequestDialog,
              private permissions: Permissions) { }

  ngOnInit() {
    this.selection.requests.changed.pipe(
      takeUntil(this.destroyed))
      .subscribe(() => this.cd.markForCheck());

    this.permissions.editableProjects.pipe(
      takeUntil(this.destroyed))
      .subscribe(editableProjects => {
        if (editableProjects) {
          this.canEdit = editableProjects.has(this.request.project);
          this.cd.markForCheck();
        }
      });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  changeQuantity(quantity: number) {
    quantity = Math.max(0, quantity);
    this.requestsDao.update(this.request.id, {quantity});
  }

  isSelected() {
    return this.selection.requests.isSelected(this.request.id);
  }

  setSelected(value: boolean) {
    value ?
      this.selection.requests.select(this.request.id) :
      this.selection.requests.deselect(this.request.id);
  }

  editNote(e: Event) {
    e.stopPropagation();
    this.requestDialog.editNote([this.request.id]);
  }

  editDropoff(e: Event) {
    e.stopPropagation();
    this.requestDialog.editDropoff([this.request.id]);
  }

  viewItem(e: Event) {
    e.stopPropagation();

    const dialogRef = this.mdDialog.open(EditItem);
    dialogRef.componentInstance.mode = 'view';

    // If acquisitions member, can edit the item
    this.permissions.permissions.pipe(take(1)).subscribe(p => {
      if (p.has('acquisitions')) { dialogRef.componentInstance.mode = 'edit'; }
    });

    dialogRef.componentInstance.item = this.item;
  }

  getTagColor(tag: string) {
    // Get string hash
    let hash = 0;
    for (let i = 0; i < tag.length; i++) {
      hash = tag.charCodeAt(i) + ((hash << 5) - hash);
    }

    const r = (hash >> 16) & 255;
    const g = (hash >> 8) & 255;
    const b = hash & 255;

    return `rgba(${[r, g, b].join(',')}, 0.15)`;
  }

  navigateToUrl(url: string) {
    window.open(url);
  }

  getRequestCost() {
    if (!this.item || !this.request) { return 0; }

    return getRequestCost(this.item.cost, this.request);
  }

  filterTag(tag: string) {
    const search = this.requestsRenderer.options.search;
    if (search.indexOf(tag) != -1) {
      return;
    }

    if (!search) {
      this.requestsRenderer.options.search = tag;
    } else {
      this.requestsRenderer.options.search += ' ' + tag;
    }
  }

  getItemName() {
    const categories = this.item.categories.split('>');
    if (categories.length > 1) {
      categories.shift();
      const subcategories = categories.join('-');
      return `${subcategories} - ${this.item.name}`;
    } else {
      return this.item.name;
    }
  }
}

