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
import {Item} from 'app/model/item';
import {RequestsService} from 'app/service/requests.service';
import {Request} from 'app/model/request';
import {EditDropoffComponent} from 'app/ui/pages/shared/dialog/edit-dropoff/edit-dropoff.component';
import {EditItemComponent} from 'app/ui/pages/shared/dialog/edit-item/edit-item.component';
import {ProjectsService} from 'app/service/projects.service';
import {GroupsService} from 'app/service/groups.service';
import {AccountingService} from 'app/service/accounting.service';
import {Project} from 'app/model/project';

@Component({
  selector: 'request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss'],
  host: {
    '[style.pointer-events]': "canEdit ? '' : 'none'"
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequestComponent implements OnInit {
  displayState = 'hidden';
  projectName: string;

  @Input()
  set request(request: Request) {
    this._request = request;

    this.projectsService.get(this.request.project)
      .subscribe((project: Project) => {
        this.projectName = project.name;
        this.cd.markForCheck();
      });
  }
  get request(): Request {
    return this._request;
  }
  _request: Request;

  @Input() item: Item;

  @Input() isReporting: boolean;

  @Input() canEdit: boolean;

  @Input() isAcquisitions: boolean;

  @Input() set printMode(v) {
    if (v) {
      this.displayState = 'visible';
      this.cd.markForCheck();
    }
  }

  @ViewChild('quantityInput') quantityInput: ElementRef;

  constructor(private cd: ChangeDetectorRef,
              private mdDialog: MatDialog,
              private elementRef: ElementRef,
              private accountingService: AccountingService,
              private requestsService: RequestsService,
              private projectsService: ProjectsService,
              private groupsService: GroupsService) { }

  ngOnInit() {
    this.requestsService.selection.changed.subscribe(() => {
      this.cd.markForCheck();
    });
  }

  changeQuantity(quantity: number) {
    quantity = Math.max(0, quantity);
    this.requestsService.update(this.request.$key, {quantity});
  }

  isSelected() {
    return this.requestsService.selection.isSelected(this.request.$key);
  }

  setSelected(value: boolean) {
    value ?
      this.requestsService.selection.select(this.request.$key) :
      this.requestsService.selection.deselect(this.request.$key);
  }

  editNote(e: Event) {
    e.stopPropagation();
    this.requestsService.editNote([this.request.$key]);
  }

  editDropoff(e: Event) {
    e.stopPropagation();

    const dialogRef = this.mdDialog.open(EditDropoffComponent);
    dialogRef.componentInstance.requestIds = [this.request.$key];
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
