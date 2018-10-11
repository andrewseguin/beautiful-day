import {Component, ElementRef, EventEmitter, Input, Output} from '@angular/core';
import {
  CostEquality, DateEquality,
  Filter,
  Query
} from 'app/ui/pages/shared/requests-list/render/request-renderer-options';
import {FILTER_TYPE_LABELS} from 'app/ui/pages/shared/requests-list/requests-search/requests-search.component';
import {FormControl, FormGroup} from '@angular/forms';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'request-filter',
  templateUrl: 'request-filter.component.html',
  styleUrls: ['request-filter.component.scss'],
})
export class RequestFilterComponent {
  filterTypeLabels = FILTER_TYPE_LABELS;
  costEqualities: CostEquality[] = ['greater than', 'less than', 'equal to'];
  dateEqualities: DateEquality[] = ['before', 'after', 'on'];
  destroyed = new Subject();

  form = new FormGroup({
    // project
    project: new FormControl(''),
    // purchaser
    purchaser: new FormControl(''),
    // request cost
    requestCostEquality: new FormControl('greater than'),
    requestCost: new FormControl(''),
    // item cost
    itemCostEquality: new FormControl('greater than'),
    itemCost: new FormControl(''),
    // dropoff date
    dropoffDateEquality: new FormControl('on'),
    dropoffDate: new FormControl(''),
    // dropoff location
    dropoffLocation: new FormControl(''),
  });

  @Input() filter: Filter;

  @Output() queryChange = new EventEmitter<Query>();

  @Output() remove = new EventEmitter();

  constructor(private elementRef: ElementRef) {
    this.form.valueChanges.pipe(takeUntil(this.destroyed))
        .subscribe(values => {
          switch (this.filter.type) {
            case 'project':
              this.queryChange.next({project: values['project']});
              break;
            case 'purchaser':
              this.queryChange.next({purchaser: values['purchaser']});
              break;
            case 'request cost':
              this.queryChange.next({
                equality: values['requestCostEquality'],
                cost: values['requestCost']
              });
              break;
            case 'item cost':
              this.queryChange.next({
                equality: values['itemCostEquality'],
                cost: values['itemCost']
              });
              break;
            case 'dropoff date':
              this.queryChange.next({
                equality: values['dropoffDateEquality'],
                date: values['dropoffDate']
              });
              break;
            case 'dropoff location':
              this.queryChange.next({
                location: values['dropoffLocation'],
              });
              break;
          }
        });
  }

  ngAfterViewInit() {
    const input = this.elementRef.nativeElement.querySelector('input');
    if (input) {
      setTimeout(() => input.focus(), 500);
    }
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
