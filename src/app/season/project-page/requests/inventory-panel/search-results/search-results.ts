import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, NgZone} from '@angular/core';
import {Item, ItemsDao} from 'app/season/dao';
import {BehaviorSubject, combineLatest, Subject} from 'rxjs';
import {auditTime, debounceTime, map, takeUntil} from 'rxjs/operators';
import {getItemsMatchingQuery} from 'app/season/utility/items-search';
import {CdkScrollable} from '@angular/cdk/overlay';

@Component({
  selector: 'search-results',
  templateUrl: 'search-results.html',
  styleUrls: ['search-results.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchResults {
  @Input()
  set search(v: string) { this._search.next(v); }
  get search(): string { return this._search.value; }
  _search = new BehaviorSubject<string>('');

  lengthToDisplay = new BehaviorSubject<number>(0);

  searchResults = combineLatest([this.itemsDao.list, this._search]).pipe(
      map(result => {
        const items = result[0];
        const search = result[1];

        if (!search || !items) {
          return [];
        }

        this.lengthToDisplay.next(30);
        return getItemsMatchingQuery(items, search);
      }));

  resultsToDisplay = combineLatest([this.searchResults, this.lengthToDisplay]).pipe(
    map(result => {
      const searchResults = result[0];
      const lengthToDisplay = result[1];

      return searchResults.slice(0, lengthToDisplay);
    }));

  private destroyed = new Subject();

  constructor(public itemsDao: ItemsDao,
              private ngZone: NgZone,
              private cdkScrollable: CdkScrollable) {
    combineLatest([this.searchResults, this.cdkScrollable.elementScrolled()]).pipe(
      auditTime(50),
      takeUntil(this.destroyed))
      .subscribe(result => {
        const searchResults = result[0] as Item[];
        const scrollEvent = result[1] as Event;

        const distance = getScrollDistanceFromBottom(scrollEvent.target as Element);
        const currentLength = this.lengthToDisplay.value;
        if (distance < 1000 && searchResults.length > currentLength) {
          // The scroll event is from outside the ngZone, enter back in
          // to render new items.
          this.ngZone.run(() => this.lengthToDisplay.next(currentLength + 30));
        }
      });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}

function getScrollDistanceFromBottom(el: Element) {
  return el.scrollHeight - el.getBoundingClientRect().height - el.scrollTop;
}
