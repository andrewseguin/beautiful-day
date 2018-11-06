import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output
} from '@angular/core';
import {
  CostEquality,
  DateEquality,
  Filter,
  Query
} from 'app/ui/season/shared/requests-list/render/request-renderer-options';
import {FILTER_TYPE_LABELS} from '../requests-search';
import {FormControl, FormGroup} from '@angular/forms';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'request-filter',
  templateUrl: 'request-filter.html',
  styleUrls: ['request-filter.scss'],
})
export class RequestFilter implements OnInit, AfterViewInit, OnChanges {
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

  constructor(private elementRef: ElementRef) {}

  ngOnChanges() {
    this.setForm();
  }

  ngOnInit() {
    this.observeChanges();
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

  private setForm() {
    const query = this.filter.query;
    if (!query) {
      return;
    }

    switch (this.filter.type) {
      case 'project':
        this.form.get('project').setValue(query['project'], {emitEvent: false});
        break;
      case 'purchaser':
        this.form.get('purchaser').setValue(query['purchaser'], {emitEvent: false});
        break;
      case 'request cost':
        this.form.get('requestCostEquality').setValue(query['equality'], {emitEvent: false});
        this.form.get('requestCost').setValue(query['cost'], {emitEvent: false});
        break;
      case 'item cost':
        this.form.get('itemCostEquality').setValue(query['equality'], {emitEvent: false});
        this.form.get('itemCost').setValue(query['cost'], {emitEvent: false});
        break;
      case 'dropoff date':
        this.form.get('dropoffDateEquality').setValue(query['equality'], {emitEvent: false});
        this.form.get('dropoffDate').setValue(query['date'], {emitEvent: false});
        break;
      case 'dropoff location':
        this.form.get('dropoffLocation').setValue(query['location'], {emitEvent: false});
        break;
      default:
        throw new Error(`Could not set value for filter type ${this.filter.type}`);
    }
  }

  private observeChanges() {
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
}
