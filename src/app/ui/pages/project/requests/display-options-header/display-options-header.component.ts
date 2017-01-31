import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import {Sort} from '../requests-group/requests-group.component';
import {Group, RequestGroupingService} from '../../../../../service/request-grouping.service';

export class RequestViewOptions {
  cost: boolean = true;
  dropoff: boolean = true;
  notes: boolean = true;
  tags: boolean = true;

  clone(): RequestViewOptions {
    const clone = new RequestViewOptions();
    clone.cost = this.cost;
    clone.dropoff = this.dropoff;
    clone.notes = this.notes;
    clone.tags = this.tags;
    return clone;
  }
}

export interface DisplayOptions {
  filter?: string;
  grouping?: Group;
  sorting?: Sort;
  viewing?: RequestViewOptions;
}

@Component({
  selector: 'display-options-header',
  templateUrl: './display-options-header.component.html',
  styleUrls: ['./display-options-header.component.scss'],
  host: {
    'class': 'md-elevation-z1',
  }
})
export class DisplayOptionsHeaderComponent implements OnInit {
  showFilter: boolean;

  filter: string;
  grouping: Group;
  sorting: Sort;
  viewing: RequestViewOptions;

  @Input()
  set displayOptions(displayOptions: DisplayOptions) {
    this.filter = displayOptions.filter;
    this.grouping = displayOptions.grouping;
    this.sorting = displayOptions.sorting;
    this.viewing = displayOptions.viewing;
  }

  @Output() optionsChanged = new EventEmitter<DisplayOptions>();

  constructor(private requestGroupingService: RequestGroupingService) { }

  ngOnInit() { }

  notify() {
    this.optionsChanged.emit({
      filter: this.filter,
      grouping: this.grouping,
      sorting: this.sorting,
      viewing: this.viewing,
    });
  }

  getGroups(): string[] {
    return this.requestGroupingService.getGroupNames();
  }

  getRequestViewOptionKeys() {
    return Object.keys(this.viewing);
  }

  getSortOptions(): Sort[] {
    return ['request added', 'cost', 'item'];
  }

  getGroupingName(grouping: string): string {
    switch (grouping) {
      case 'all': return 'All';
      case 'category': return 'Category';
      case 'date': return 'Date Needed';
      case 'dropoff': return 'Dropoff Location';
      case 'tags': return 'Tags';
    }
  }
}
