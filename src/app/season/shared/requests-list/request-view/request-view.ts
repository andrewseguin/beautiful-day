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
import {Accounting} from 'app/season/services/accounting';
import {RequestsRenderer} from 'app/season/services/requests-renderer/requests-renderer';
import {Permissions} from 'app/season/services/permissions';
import {Subject} from 'rxjs';
import {distinctUntilChanged, takeUntil} from 'rxjs/operators';
import {APPROVAL_NEGATERS, Item, ProjectsDao, Request, RequestsDao} from 'app/season/dao';
import {Selection} from 'app/season/services';
import {RequestDialog} from 'app/season/shared/dialog/request/request-dialog';
import {getItemName} from 'app/season/utility/item-name';
import {getRequestCost} from 'app/season/utility/request-cost';
import {isMobile} from 'app/utility/media-matcher';
import {DatePipe} from '@angular/common';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'request',
  templateUrl: 'request-view.html',
  styleUrls: ['request-view.scss'],
  host: {
    '[style.pointer-events]': "canEdit ? '' : 'none'",
    '[class.can-edit]': 'canEdit',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestView implements OnInit {
  getItemName = getItemName;

  private destroyed = new Subject();

  @Input() request: Request;

  @Input() item: Item;

  @Input() isReporting: boolean;

  canEdit: boolean;

  @ViewChild('quantityInput') quantityInput: ElementRef;

  previousChangesMsg = '';

  quantity = new FormControl();

  constructor(private cd: ChangeDetectorRef,
              public requestsRenderer: RequestsRenderer,
              private mdDialog: MatDialog,
              private elementRef: ElementRef,
              private accounting: Accounting,
              private requestsDao: RequestsDao,
              private selection: Selection,
              private projectsDao: ProjectsDao,
              private requestDialog: RequestDialog,
              public permissions: Permissions) { }

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

    this.quantity.valueChanges.pipe(
        takeUntil(this.destroyed),
        distinctUntilChanged()) // Input fires twice due to issue/12540
        .subscribe(quantity => {
          quantity = Math.max(0, quantity);
          this.requestsDao.update(this.request.id, {quantity: quantity});
        });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  ngOnChanges() {
    this.quantity.setValue(this.request.quantity, {emitEvent: false});
    this.updatePreviousChangesMessage();
  }

  isSelected() {
    return this.selection.requests.isSelected(this.request.id);
  }

  setSelected(value: boolean) {
    value ?
      this.selection.requests.select(this.request.id) :
      this.selection.requests.deselect(this.request.id);
  }

  navigateToUrl(url: string) {
    window.open(url);
  }

  getRequestCost() {
    if (!this.item || !this.request) { return 0; }

    return getRequestCost(this.item.cost, this.request);
  }

  edit(id: string, e: Event) {
    if (!this.canEdit || isMobile()) {
      return;
    }

    e.stopPropagation();

    switch (id) {
      case 'note':
        this.requestDialog.editNote([this.request.id]);
        break;
      case 'dropoff':
        this.requestDialog.editDropoff([this.request.id]);
        break;
      case 'status':
        this.requestDialog.editStatus([this.request.id]);
        break;
      case 'costAdjustment':
        this.requestDialog.editCostAdjustment([this.request.id]);
        break;
      case 'allocation':
        this.requestDialog.editAllocation([this.request.id]);
        break;
      case 'purchaser':
        this.requestDialog.editPurchaser([this.request.id]);
        break;
      case 'requester':
        this.requestDialog.editRequester([this.request.id]);
        break;
      case 'tag':
        this.requestDialog.editTags([this.request.id]);
        break;
    }
  }

  private updatePreviousChangesMessage() {
    const propToDisplayName = {
      note: 'Note',
      quantity: 'Quantity',
      dropoff: 'Dropoff location',
      date: 'Dropoff date',
    };

    const valueToDisplay = {
      note: v => v,
      quantity: v => v,
      dropoff: v => v,
      date: v => new DatePipe('en-us').transform(v),
    };

    this.previousChangesMsg = '';
    const changes = this.request.prevApproved;
    if (changes) {
      const previousChanges = [];
      APPROVAL_NEGATERS.forEach(prop => {
        const propDisplayName = propToDisplayName[prop];
        const valueDisplay = valueToDisplay[prop](changes[prop]);
        if (changes[prop] !== undefined) {
          const msg = `${propDisplayName}: ${valueDisplay || 'none'}`;
          previousChanges.push(msg);
        }
      });

      this.previousChangesMsg = previousChanges.join('; ');
    }
  }
}
