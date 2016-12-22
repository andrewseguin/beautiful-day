import {
  Component, OnInit, Input, AnimationTransitionEvent, ViewChildren,
  QueryList, ElementRef, animate, style, transition, state, trigger
} from '@angular/core';
import {RequestGroup} from "../../../../service/request-grouping.service";
import {RequestComponent} from "../request/request.component";
import {Request} from "../../../../model/request";
import {RequestsService} from "../../../../service/requests.service";

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
export class RequestsGroupComponent implements OnInit {

  @ViewChildren(RequestComponent) requestComponents: QueryList<RequestComponent>;

  @Input() requestGroup: RequestGroup;

  constructor(private requestsService: RequestsService) { }

  ngOnInit() {}

  showRequest(requestKey: string, scrollableContent: ElementRef) {
    const newRequest = this.requestComponents.find(requestComponent => {
      return requestComponent.getRequestKey() == requestKey;
    });
    if (!newRequest) return;

    // Highlight the new request
    newRequest.highlight();

    // Put the item on the bottom of the view and then scoot the view down a bit
    newRequest.scrollIntoView();
    scrollableContent.nativeElement.scrollTop += 20;
  }

  getRequestKey(index: number, request: Request) {
    return request.$key;
  }

  hasAllSelectedRequests(requests: Request[]): boolean {
    return requests.every(request => {
      return this.requestsService.isSelected(request.$key);
    })
  }

  toggleGroupSelection(select: boolean, requests: Request[]) {
    requests.forEach(request => {
      this.requestsService.setSelected(request.$key, select);
    })
  }

  groupTransitionAnimationDone(e: AnimationTransitionEvent) {
    // When the group transition finishes, load in all the remaining requests
    if (e.toState == 'void') return;

    setTimeout(() => {
      // Show the remaining requests after a small delay after the animation finishes.
      this.requestComponents.forEach(requestComponent => requestComponent.show());
    }, 150);
  }
}
