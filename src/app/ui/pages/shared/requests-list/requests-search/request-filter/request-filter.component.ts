import {Component, ElementRef, EventEmitter, Input, Output} from '@angular/core';
import {Filter} from 'app/ui/pages/shared/requests-list/render/request-renderer-options';
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

  destroyed = new Subject();

  form = new FormGroup({
    project: new FormControl('')
  });

  @Input() filter: Filter;

  @Output() queryChange = new EventEmitter();

  @Output() remove = new EventEmitter();

  constructor(private elementRef: ElementRef) {
    this.form.valueChanges.pipe(takeUntil(this.destroyed))
        .subscribe(values => {
          switch (this.filter.type) {
            case 'project':
              this.queryChange.next({project: values['project']});
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
