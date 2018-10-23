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
import {EditDropoffComponent} from 'app/ui/pages/shared/dialog/edit-dropoff/edit-dropoff.component';
import {EditItemComponent} from 'app/ui/pages/shared/dialog/edit-item/edit-item.component';
import {AccountingService, getRequestCost} from 'app/service/accounting.service';
import {RequestsRenderer} from 'app/ui/pages/shared/requests-list/render/requests-renderer';
import {PermissionsService} from 'app/service/permissions.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ProjectsDao, RequestsDao} from 'app/service/dao';
import {Selection} from 'app/service';
import {RequestDialog} from 'app/ui/pages/shared/dialog/request.dialog';

@Component({
  selector: 'request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss'],
  host: {
    '[style.pointer-events]': "canEdit ? '' : 'none'"
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestComponent implements OnInit {
  private destroyed = new Subject();

  displayState = 'hidden';

  @Input() request: Request;

  @Input() item: Item;

  @Input() isReporting: boolean;

  @Input() canEdit: boolean;

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
              private accountingService: AccountingService,
              private requestsDao: RequestsDao,
              private selection: Selection,
              private projectsDao: ProjectsDao,
              private requestDialog: RequestDialog,
              private permissionsService: PermissionsService) { }

  ngOnInit() {
    this.selection.requests.changed.pipe(
      takeUntil(this.destroyed))
      .subscribe(() => this.cd.markForCheck());

    this.permissionsService.editableProjects.pipe(
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

    const dialogRef = this.mdDialog.open(EditDropoffComponent);
    dialogRef.componentInstance.requestIds = [this.request.id];
    dialogRef.componentInstance.selectedDropoffLocation = this.request.dropoff;
    dialogRef.componentInstance.setDateFromRequest(this.request.date);
    dialogRef.componentInstance.project = this.request.project;
  }

  viewItem(e: Event) {
    e.stopPropagation();

    const dialogRef = this.mdDialog.open(EditItemComponent);
    dialogRef.componentInstance.mode = 'view';

    // If acquisitions member, can edit the item
    this.permissionsService.permissions.subscribe(p => {
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

