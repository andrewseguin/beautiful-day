import {
  Component,
  Input,
  AnimationTransitionEvent,
  ViewChildren,
  QueryList,
  ElementRef,
  animate,
  style,
  transition,
  state,
  trigger, EventEmitter, Output
} from "@angular/core";
import {RequestComponent} from "../request/request.component";
import {RequestViewOptions} from '../display-options-header/display-options-header.component';
import {Item} from '../../../../model/item';
import {RequestSortPipe} from '../../../../pipe/request-sort.pipe';
import {Request} from '../../../../model/request';
import {RequestGroup} from '../../../../service/request-grouping.service';
import {RequestsService} from '../../../../service/requests.service';
import {ItemsService} from '../../../../service/items.service';

export type Sort = 'request added' | 'item' | 'cost';

@Component({
  selector: 'requests-group',
  templateUrl: './requests-group.component.html',
  styleUrls: ['./requests-group.component.scss'],
  host: {
    '[style.display]': "processedRequests && processedRequests.length ? 'block' : 'none'",
    '[class.md-elevation-z4]': 'true',
    '[@groupTransition]': "requestGroup.title",
    '(@groupTransition.done)': "groupTransitionAnimationDone($event, requestGroup)"
  },
  animations: [
    trigger('groupTransition', [
      state('*', style({transform: 'translateY(0%)'})),
      state('void', style({opacity: '0'})),
      transition(':enter', [
        style({transform: 'translateY(100px)'}),
        animate('500ms ease-in-out')]
      ),
    ])
  ]
})
export class RequestsGroupComponent {
  items: Item[];
  requestSortPipe = new RequestSortPipe();
  processedRequests: Request[] = [];
  showRequests: boolean;

  @Input() canEdit: boolean;

  @ViewChildren(RequestComponent) requestComponents: QueryList<RequestComponent>;

  _filter: string;
  @Input() set filter(filter: string) {
    this._filter = filter;
    if (this.requestGroup) { this.sortAndFilterRequests(); }
  }
  get filter(): string { return this._filter; }

  _sort: Sort;
  @Input() set sort(sort: Sort) {
    this._sort = sort;
    if (this.requestGroup) { this.sortAndFilterRequests(); }
  }
  get sort(): Sort { return this._sort; }

  _requestGroup: RequestGroup;
  @Input() set requestGroup(requestGroup: RequestGroup) {
    this._requestGroup = requestGroup;
    this.sortAndFilterRequests();
  }
  get requestGroup(): RequestGroup { return this._requestGroup; }

  @Input() requestViewOptions: RequestViewOptions;

  @Output() filterTag = new EventEmitter<string>();

  constructor(private requestsService: RequestsService,
              private itemsService: ItemsService) {
    this.itemsService.getItems().subscribe(items => {
      this.items = items;
      this.sortAndFilterRequests();
    });
  }

  showRequest(requestKey: string, scrollableContent: ElementRef) {
    const newRequest = this.requestComponents.find(requestComponent => {
      return requestComponent.getRequestKey() == requestKey;
    });
    if (!newRequest) return;

    // Highlight the new request
    newRequest.highlight();

    // Put the item on the bottom of the view and then scoot the view down a bit
    newRequest.scrollIntoView();
    scrollableContent.nativeElement.scrollTop += 80;
  }

  sortAndFilterRequests() {
    if (!this.items) return;

    const requests = this.requestGroup.requests;
    this.processedRequests =
       this.requestSortPipe.transform(requests, this.sort, this.filter, this.items);
  }

  getRequestKey(index: number, request: Request) {
    return request.$key;
  }

  hasAllSelectedRequests(): boolean {
    return this.requestGroup.requests.every(request => {
      return this.requestsService.isSelected(request.$key);
    })
  }

  toggleGroupSelection(select: boolean) {
    this.requestGroup.requests.forEach(request => {
      this.requestsService.setSelected(request.$key, select);
    })
  }

  groupTransitionAnimationDone(e: AnimationTransitionEvent) {
    // When the group transition finishes, load in all the remaining requests
    if (e.toState == 'void') return;

    setTimeout(() => { this.showRequests = true }, 150);
  }
}
