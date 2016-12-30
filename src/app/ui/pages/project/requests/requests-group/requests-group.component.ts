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
  trigger
} from "@angular/core";
import {RequestGroup} from "../../../../../service/request-grouping.service";
import {RequestComponent} from "../request/request.component";
import {Request} from "../../../../../model/request";
import {RequestsService} from "../../../../../service/requests.service";
import {RequestViewOptions} from "../project-requests.component";
import {RequestSortPipe} from "../../../../../pipe/request-sort.pipe";
import {ItemsService} from "../../../../../service/items.service";

export type Sort = 'request added' | 'item' | 'cost';

@Component({
  selector: 'requests-group',
  templateUrl: './requests-group.component.html',
  styleUrls: ['./requests-group.component.scss'],
  host: {
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
  requestSortPipe = new RequestSortPipe();
  sortedRequests: Request[] = [];
  showRequests: boolean;

  @ViewChildren(RequestComponent) requestComponents: QueryList<RequestComponent>;

  _sort: Sort;
  @Input() set sort(sort: Sort) {
    this._sort = sort;
    if (this.requestGroup) { this.sortRequests(); }
  }
  get sort(): Sort { return this._sort; }

  _requestGroup: RequestGroup;
  @Input() set requestGroup(requestGroup: RequestGroup) {
    this._requestGroup = requestGroup;
    this.sortRequests();
  }
  get requestGroup(): RequestGroup { return this._requestGroup; }

  @Input() requestViewOptions: RequestViewOptions;

  constructor(private requestsService: RequestsService,
              private itemsService: ItemsService) {}

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

  sortRequests() {
    this.itemsService.getItems().subscribe(items => {
      this.sortedRequests =
          this.requestSortPipe.transform(this.requestGroup.requests, this.sort, items);
    });
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

    setTimeout(() => {
      this.showRequests = true;
      // Show the remaining requests after a small delay after the animation finishes.
      //this.requestComponents.forEach(requestComponent => requestComponent.show());
    }, 150);
  }
}
