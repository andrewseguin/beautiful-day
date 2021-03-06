import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild
} from '@angular/core';
import {FormControl} from '@angular/forms';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'inventory-search',
  templateUrl: 'inventory-search.html',
  styleUrls: ['inventory-search.scss'],
  host: {
    '[class.showSearch]': 'showSearch',
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InventorySearch  {
  showSearch = false;

  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;

  @Output() searchChange = new EventEmitter<string>();

  search = new FormControl('');

  private destroyed = new Subject();

  constructor() {
    this.search.valueChanges.pipe(takeUntil(this.destroyed))
        .subscribe(value => this.searchChange.emit(value));
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  focus() {
    setTimeout(() => {
      if (this.searchInput.nativeElement && this.showSearch) {
        this.searchInput.nativeElement.focus();
      }
    }, 400); // Bit longer time than it takes to animate in.
  }
}
