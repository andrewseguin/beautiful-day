import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Subject} from 'rxjs';
import {DateEquality, DateEqualityQuery} from 'app/season/services/requests-renderer/query';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'date-equality-form',
  templateUrl: 'date-equality-form.html',
  styleUrls: ['date-equality-form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateEqualityForm implements AfterViewInit {
  equalities: {id: DateEquality, label: string}[] = [
    {id: 'before', label: 'before'},
    {id: 'on', label: 'on'},
    {id: 'after', label: 'after'},
  ];
  form = new FormGroup({
    equality: new FormControl('on'),
    date: new FormControl(''),
  });
  destroyed = new Subject();

  @Input()
  set query(query: DateEqualityQuery) {
    this._query = query;

    if (!query) {
      return;
    }

    if (query.equality) {
      this.form.get('equality').setValue(query.equality, {emitEvent: false});
    }

    if (query.date) {
      this.form.get('date').setValue(new Date(query.date), {emitEvent: false});
    }
  }
  get query(): DateEqualityQuery { return this._query; }
  _query: DateEqualityQuery;

  @Output() queryChange = new EventEmitter<DateEqualityQuery>();

  constructor(private elementRef: ElementRef) {
    this.form.valueChanges.pipe(
        takeUntil(this.destroyed))
        .subscribe(value => {
          this.queryChange.next({
            equality: value.equality,
            date: value.date.toISOString(),
          });
        });
  }

  ngAfterViewInit() {
    const input = this.elementRef.nativeElement.querySelector('input');
    setTimeout(() => {
      if (input) {
        input.focus();
      }
    }, 500);
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
