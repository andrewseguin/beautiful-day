import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Subject} from 'rxjs';
import {InputEquality, State, StateQuery} from 'app/season/services/requests-renderer/query';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'state-query-form',
  templateUrl: 'state-query-form.html',
  styleUrls: ['state-query-form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StateQueryForm implements OnChanges {
  equalities: {id: InputEquality, label: string}[] = [
    {id: 'is', label: 'is'},
    {id: 'notIs', label: 'is not'},
  ];
  states: {id: State, label: string}[] = [
    {id: 'approved', label: 'approved'},
    {id: 'purchased', label: 'purchased'},
    {id: 'distributed', label: 'distributed'},
    {id: 'previouslyApproved', label: 'previously approved'},
  ];
  form = new FormGroup({
    equality: new FormControl('is'),
    state: new FormControl(''),
  });
  destroyed = new Subject();

  @Input() query: StateQuery;

  @Output() queryChange = new EventEmitter<StateQuery>();

  constructor() {
    this.form.valueChanges.pipe(
        takeUntil(this.destroyed))
        .subscribe(value => this.queryChange.next(value));
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges.query) {
      if (this.query && this.query.equality) {
        this.form.get('equality').setValue(this.query.equality || '', {emitEvent: false});
      }

      if (this.query && this.query.state) {
        this.form.get('state').setValue(this.query.state || '', {emitEvent: false});
      }
    }
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
