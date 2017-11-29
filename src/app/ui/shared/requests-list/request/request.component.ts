import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatDialog} from '@angular/material';
import {Item} from 'app/model/item';
import {RequestsService} from 'app/service/requests.service';
import {Request} from 'app/model/request';
import {ItemsService} from 'app/service/items.service';
import {EditDropoffComponent} from '../../dialog/edit-dropoff/edit-dropoff.component';
import {EditItemComponent} from '../../dialog/edit-item/edit-item.component';
import {ProjectsService} from 'app/service/projects.service';
import {RequestViewOptions} from 'app/model/request-view-options';
import {GroupsService} from 'app/service/groups.service';
import {AccountingService} from 'app/service/accounting.service';
import {Project} from 'app/model/project';

@Component({
  selector: 'request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss'],
  animations: [
    trigger('highlightTrigger', [
      state('normal', style({background: 'transparent'})),
      state('highlight', style({background: 'rgba(255,235,59,.2)'})),
      transition('highlight => normal', [
        animate('1350ms cubic-bezier(0.35, 0, 0.25, 1)')]
      ),
      transition('normal => highlight', [
        animate('250ms cubic-bezier(0.35, 0, 0.25, 1)')]
      ),
    ]),
    trigger('displayTrigger', [
      state('hidden', style({opacity: 0, height: '50px'})),
      state('visible', style({opacity: 1, height: '*'})),
      transition('* => visible', [
        animate('350ms cubic-bezier(0.35, 0, 0.25, 1)')]
      ),
    ]),
  ],
  host: {
    '[style.pointer-events]': "canEdit ? '' : 'none'"
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequestComponent implements OnInit {
  item: Item;
  highlightState = 'normal';
  displayState = 'hidden';
  request: Request;
  projectName: string;
  itemDisplayName: string;

  @Input() isReporting: boolean;
  @Input() canEdit: boolean;
  @Input() requestId: string;
  @Input() groupIndex: number;
  @Input() requestViewOptions: RequestViewOptions;

  @Input() set show(show: boolean) {
    show ? this.setVisible() : this.displayState = 'hidden';
  }

  @Input() set printMode(v) {
    if (v) {
      this.displayState = 'visible';
      this.cd.markForCheck();
    }
  }

  @Output() filterTag = new EventEmitter<string>();

  @ViewChild('quantityInput') quantityInput: ElementRef;

  constructor(private cd: ChangeDetectorRef,
              private mdDialog: MatDialog,
              private elementRef: ElementRef,
              private accountingService: AccountingService,
              private requestsService: RequestsService,
              private projectsService: ProjectsService,
              private groupsService: GroupsService,
              private itemsService: ItemsService) { }

  ngOnInit() {
    this.requestsService.get(this.requestId).subscribe(request => {
      this.request = request;
      this.cd.markForCheck();

      this.itemsService.get(request.item).subscribe((item: Item) => {
        this.item = item;
        this.itemDisplayName = item.name;
        this.cd.markForCheck();
      });

      this.projectsService.get(this.request.project).subscribe((project: Project) => {
        this.projectName = project.name;
        this.cd.markForCheck();
      });
    });

    this.requestsService.selection.onChange.subscribe(() => {
      this.cd.markForCheck();
    });
  }

  setVisible() {
    // If one of the first 5 items, then immediately display. Otherwise, stagger the
    // display of the item to optimize rendering.
    if (this.groupIndex < 20) {
      setTimeout(() => {
        this.displayState = 'visible';
        this.cd.markForCheck();
      }, 20 * this.groupIndex);
    } else {
      setTimeout(() => {
        this.displayState = 'visible';
        this.cd.markForCheck();
      }, (20 * 20) + 1000);
    }
  }

  scrollIntoView(): void {
    this.elementRef.nativeElement.scrollIntoView(false);
    this.highlight();
  }

  highlight(): void {
    this.displayState = 'visible';
    this.highlightState = 'highlight';
    this.cd.markForCheck();

    setTimeout(() => {
      this.highlightState = 'normal';
      this.cd.markForCheck();
    }, 1000);
  }

  changeQuantity(quantity: number) {
    quantity = Math.max(0, quantity);
    this.requestsService.update(this.requestId, {quantity});
  }

  isSelected() {
    return this.requestsService.selection.isSelected(this.requestId);
  }

  setSelected(value: boolean) {
    value ?
      this.requestsService.selection.select(this.requestId) :
      this.requestsService.selection.deselect(this.requestId);
  }

  editNote(e: Event) {
    e.stopPropagation();
    this.requestsService.editNote([this.requestId]);
  }

  editDropoff(e: Event) {
    e.stopPropagation();

    const dialogRef = this.mdDialog.open(EditDropoffComponent);
    dialogRef.componentInstance.requestIds = [this.requestId];
    dialogRef.componentInstance.selectedDropoffLocation = this.request.dropoff;
    dialogRef.componentInstance.setDateFromRequest(this.request.date);
    dialogRef.componentInstance.project = this.request.project;
  }

  viewItem(e: Event) {
    e.stopPropagation();

    const dialogRef = this.mdDialog.open(EditItemComponent);
    dialogRef.componentInstance.mode = 'view';

    // If acquisitions member, can edit the item
    this.groupsService.isMember('acquisitions').subscribe(isAcquisitions => {
      if (isAcquisitions) { dialogRef.componentInstance.mode = 'edit'; }
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

    return this.accountingService.getRequestCost(this.item.cost, this.request);
  }
}
