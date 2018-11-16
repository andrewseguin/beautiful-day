import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Subject} from 'rxjs';
import {InputQuery} from 'app/season/services/requests-renderer/query';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'input-query-form',
  templateUrl: 'input-query-form.html',
  styleUrls: ['input-query-form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputQueryForm implements AfterViewInit {
  input = new FormControl('');
  destroyed = new Subject();

  @Input()
  set query(query: InputQuery) {
    this._query = query;

    if (!query) {
      return;
    }

    if (query.input) {
      this.input.setValue(query.input || '', {emitEvent: false});
    }
  }
  get query(): InputQuery { return this._query; }
  _query: InputQuery;

  @Output() queryChange = new EventEmitter<InputQuery>();

  constructor(private elementRef: ElementRef) {
    this.input.valueChanges.pipe(
        takeUntil(this.destroyed))
        .subscribe(value => {
          this.queryChange.next({input: value});
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
