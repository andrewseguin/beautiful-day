import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {BehaviorSubject, combineLatest, Observable, Subject} from 'rxjs';
import {InputEquality, InputQuery} from 'app/season/utility/search/query';
import {map, startWith, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'input-query-form',
  templateUrl: 'input-query-form.html',
  styleUrls: ['input-query-form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputQueryForm implements AfterViewInit, OnChanges {
  equalities: {id: InputEquality, label: string}[] = [
    {id: 'contains', label: 'contains'},
    {id: 'is', label: 'is'},
    {id: 'notContains', label: `doesn't contain`},
    {id: 'notIs', label: 'is not'},
  ];
  form = new FormGroup({
    equality: new FormControl('contains'),
    input: new FormControl(''),
  });
  destroyed = new Subject();

  filteredOptions: Observable<string[]>;

  @Input() query: InputQuery;

  @Input() options;
  _options = new BehaviorSubject([]);

  @Input() focusInput: boolean;

  @Output() queryChange = new EventEmitter<InputQuery>();

  constructor(private elementRef: ElementRef) {
    this.form.valueChanges.pipe(
        takeUntil(this.destroyed))
        .subscribe(value => this.queryChange.next(value));

    const inputChanges = this.form.valueChanges.pipe(startWith(null));
    this.filteredOptions = combineLatest([this._options, inputChanges]).pipe(map(result => {
      const options = result[0] as string[];
      const input = this.form.value.input as string;
      return options.filter(o => o.toLowerCase().includes(input.toLowerCase())).sort();
    }));
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges.query) {
      if (this.query && this.query.input) {
        this.form.get('input').setValue(this.query.input || '', {emitEvent: false});
      }
    }

    if (simpleChanges.options) {
      this._options.next(this.options || []);
    }
  }

  ngAfterViewInit() {
    const input = this.elementRef.nativeElement.querySelector('input');
    setTimeout(() => {
      if (input && this.focusInput) {
        input.focus();
      }
    }, 500);
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
