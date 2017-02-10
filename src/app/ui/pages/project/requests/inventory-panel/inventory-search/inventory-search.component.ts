import {
  Component,
  animate,
  transition,
  style,
  state,
  trigger,
  ViewChild,
  AnimationTransitionEvent,
  EventEmitter,
  Output, ElementRef
} from '@angular/core';

export type SearchState = 'open' | 'closed';

@Component({
  selector: 'inventory-search',
  templateUrl: './inventory-search.component.html',
  styleUrls: ['./inventory-search.component.scss'],
  animations: [
    trigger('searchContainer', [
      state('open', style({transform: 'translate3d(0, 0, 0)'})),
      state('closed', style({transform: 'translate3d(100%, 0px, 0px)'})),
      transition('open <=> closed', [
        animate('350ms cubic-bezier(0.35, 0, 0.25, 1)')]
      ),
    ]),
    trigger('searchIcon', [
      state('open', style({transform: 'translate3d(0, 0, 0)'})),
      state('closed', style({transform: 'translate3d(-48px, 0px, 0px)'})),
      transition('open <=> closed', [
        animate('350ms cubic-bezier(0.35, 0, 0.25, 1)')]
      ),
    ]),
    trigger('searchInput', [
      state('open', style({'opacity': '1'})),
      state('closed', style({'opacity': '0'})),
      transition('open <=> closed', [
        animate('350ms cubic-bezier(0.35, 0, 0.25, 1)')
      ])
    ])
  ],
  host: {
    '[@searchContainer]': 'searchState',
    '(@searchContainer.done)': 'searchContainerAnimationDone($event)'
  }
})
export class InventorySearchComponent  {
  searchState: SearchState = 'closed';

  @ViewChild('searchInput') searchInput: ElementRef;

  @Output('searchChanged') searchChanged = new EventEmitter<string>();

  searchContainerAnimationDone(e: AnimationTransitionEvent) {
    if (e.toState == 'open' && this.searchState == 'open') {
      this.searchInput.nativeElement.focus();
    }
  }

  _search: string = '';
  set search(s: string) {
    this._search = s;
    this.searchChanged.emit(s)
  }
  get search(): string { return this._search; }
}
