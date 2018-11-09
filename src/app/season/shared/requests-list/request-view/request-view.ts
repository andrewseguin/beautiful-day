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
import {EditItem} from 'app/season/shared/dialog/edit-item/edit-item';
import {Accounting} from 'app/season/services/accounting';
import {RequestsRenderer} from 'app/season/services/requests-renderer/requests-renderer';
import {Permissions} from 'app/season/services/permissions';
import {Subject} from 'rxjs';
import {take, takeUntil} from 'rxjs/operators';
import {ProjectsDao, RequestsDao, Item, Request} from 'app/season/dao';
import {Selection} from 'app/season/services';
import {RequestDialog} from 'app/season/shared/dialog/request/request-dialog';
import {getItemName} from 'app/season/utility/item-name';
import {getRequestCost} from 'app/season/utility/request-cost';

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
  getItemName = getItemName;

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
}
