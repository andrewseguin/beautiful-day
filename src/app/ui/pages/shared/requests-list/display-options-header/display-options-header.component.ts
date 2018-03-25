import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import {Sort} from '../requests-group/requests-group.component';
import {Group, RequestGroupingService} from 'app/service/request-grouping.service';
import {DisplayOptions} from 'app/model/display-options';
import {RequestViewOptions} from 'app/model/request-view-options';
import {GroupsService} from 'app/service/groups.service';

@Component({
  selector: 'display-options-header',
  templateUrl: './display-options-header.component.html',
  styleUrls: ['./display-options-header.component.scss'],
  host: {
    'class': 'mat-elevation-z1',
  }
})
export class DisplayOptionsHeaderComponent implements OnInit {
  showFilter: boolean;
  isAcquisitions: boolean;

  filter: string;
  grouping: Group;
  sorting: Sort;
  viewing: RequestViewOptions;
  reverseSort: boolean;

  @Input()
  set displayOptions(displayOptions: DisplayOptions) {
    this.filter = displayOptions.filter;
    this.showFilter = !!this.filter;
    this.grouping = displayOptions.grouping;
    this.sorting = displayOptions.sorting;
    this.reverseSort = displayOptions.reverseSort;
    this.viewing = displayOptions.viewing;
  }

  @Output() optionsChanged = new EventEmitter<DisplayOptions>();

  constructor(private requestGroupingService: RequestGroupingService,
              private groupsService: GroupsService) {
    this.groupsService.isMember('acquisitions').subscribe(v => this.isAcquisitions = v);
  }

  ngOnInit() { }

  notify() {
    this.optionsChanged.emit({
      filter: this.filter,
      grouping: this.grouping,
      sorting: this.sorting,
      reverseSort: this.reverseSort,
      viewing: {
        cost: this.viewing.cost,
        dropoff: this.viewing.dropoff,
        notes: this.viewing.notes,
        tags: this.viewing.tags
      }
    });
  }

  getGroups(): string[] {
    return this.requestGroupingService.getGroupNames();
  }

  getRequestViewOptionKeys() {
    return Object.keys(this.viewing);
  }

  getSortOptions(): Sort[] {
    const sortOptions: Sort[] =
        ['request added', 'request cost', 'item cost', 'item name', 'date needed'];
    if (this.isAcquisitions) {
      sortOptions.push('purchaser');
    }

    return sortOptions;
  }

  getGroupingName(grouping: string): string {
    switch (grouping) {
      case 'all': return 'All';
      case 'category': return 'Category';
      case 'date': return 'Date Needed';
      case 'dropoff': return 'Dropoff Location';
      case 'tags': return 'Tags';
      case 'item': return 'Item';
    }
  }

  setSort(sort: Sort) {
    this.reverseSort = this.sorting == sort ? !this.reverseSort : false;
    this.sorting = sort;
    this.notify();
  }
}
