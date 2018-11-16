import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Subject} from 'rxjs';
import {NumberEquality, NumberEqualityQuery} from 'app/season/services/requests-renderer/query';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'number-equality-form',
  templateUrl: 'number-equality-form.html',
  styleUrls: ['number-equality-form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NumberEqualityForm implements AfterViewInit {
  equalities: {id: NumberEquality, label: string}[] = [
    {id: 'greaterThan', label: 'greater than'},
    {id: 'equalTo', label: 'equal to'},
    {id: 'lessThan', label: 'less than'},
  ];
  form = new FormGroup({
    equality: new FormControl('greaterThan'),
    value: new FormControl(''),
  });
  destroyed = new Subject();

  @Input()
  set query(query: NumberEqualityQuery) {
    this._query = query;

    if (!query) {
      return;
    }

    if (query.equality) {
      this.form.get('equality').setValue(query.equality, {emitEvent: false});
    }

    if (query.value) {
      this.form.get('value').setValue(query.value, {emitEvent: false});
    }
  }
  get query(): NumberEqualityQuery { return this._query; }
  _query: NumberEqualityQuery;

  @Output() queryChange = new EventEmitter<NumberEqualityQuery>();

  constructor(private elementRef: ElementRef, public cd: ChangeDetectorRef) {
    this.form.valueChanges.pipe(
        takeUntil(this.destroyed))
        .subscribe(value => {
          this.queryChange.next({
            equality: value.equality,
            value: value.value,
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
