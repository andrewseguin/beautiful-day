import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input, NgZone,
  Output, ViewChild
} from '@angular/core';
import {RequestGroup} from 'app/ui/pages/shared/requests-list/render/request-grouping';
import {auditTime, debounceTime, takeUntil} from 'rxjs/operators';
import {RequestsRenderer} from 'app/ui/pages/shared/requests-list/render/requests-renderer';
import {fromEvent, Observable, Observer, Subject} from 'rxjs';
import {
  Filter,
  RequestRendererOptions, RequestRendererOptionsState
} from 'app/ui/pages/shared/requests-list/render/request-renderer-options';
import {CdkPortal} from '@angular/cdk/portal';

@Component({
  selector: 'requests-list',
  templateUrl: './requests-list.component.html',
  styleUrls: ['./requests-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RequestsRenderer]
})
export class RequestsListComponent {
  destroyed = new Subject();
  private elementScrolled: Observable<Event> = Observable.create((observer: Observer<Event>) =>
    this.ngZone.runOutsideAngular(() =>
      fromEvent(this.elementRef.nativeElement, 'scroll').pipe(
        takeUntil(this.destroyed))
        .subscribe(observer)));

  loadingRequests: boolean;

  requestGroups: RequestGroup[];
  renderedRequestGroups: RequestGroup[];
  requestsToDisplay = 10;

  @Input() set requestRendererOptionsState(state: RequestRendererOptionsState) {
    this.requestsRenderer.options.setState(state);
  }

  @Input() printMode: boolean;

  @Output() requestRendererOptionsChanged = new EventEmitter<RequestRendererOptionsState>();

  constructor(public requestsRenderer: RequestsRenderer,
              public cd: ChangeDetectorRef,
              public ngZone: NgZone,
              public elementRef: ElementRef) { }

  ngOnInit() {
    this.requestsRenderer.initialize();
    const options = this.requestsRenderer.options;
    options.changed.pipe(debounceTime(100)).subscribe(() => {
      this.requestRendererOptionsChanged.next(options.getState());
      this.elementRef.nativeElement.scrollTop = 0;
    });

    // After 200ms of scrolling, add 50 more requests if near bottom of screen
    this.elementScrolled.pipe(
      auditTime(200),
      takeUntil(this.destroyed))
      .subscribe(() => {
        const el = this.elementRef.nativeElement;
        const viewHeight = el.getBoundingClientRect().height;
        const scrollTop = el.scrollTop;
        const scrollHeight = el.scrollHeight;

        const distanceFromBottom = scrollHeight - scrollTop - viewHeight;
        if (distanceFromBottom < 1000 && scrollTop > 200) {
          this.requestsToDisplay += 40;
          this.render();
          this.cd.detectChanges();
        } else if (scrollTop < 200) {
          if (this.requestsToDisplay != 20) {
            this.requestsToDisplay = 20;
            this.render();
            this.cd.detectChanges();
          }
        }
    });

    // When request groups change, render the first ten, then debounce and render more
    this.requestsRenderer.requestGroups.pipe(
      takeUntil(this.destroyed))
      .subscribe(requestGroups => {
        this.requestGroups = requestGroups;
        this.render();
      });

  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  render() {
    this.renderedRequestGroups = [];
    this.renderMoreRequests(this.requestsToDisplay);
    this.cd.markForCheck();
  }

  /** Render more requests, shoud only be called by render and itself. */
  renderMoreRequests(threshold: number) {
    // Return if there are no groups to render
    if (!this.requestGroups || !this.requestGroups.length) {
      return;
    }

    // If no groups are rendered yet, start by adding the first group
    if (!this.renderedRequestGroups.length) {
      this.renderNextGroup();
    }

    const groupIndex = this.renderedRequestGroups.length - 1;
    const renderGroup = this.renderedRequestGroups[groupIndex];
    const renderLength = renderGroup.requests.length;

    const actualGroup = this.requestGroups[groupIndex];
    const actualLength = actualGroup.requests.length;

    // Return if all requests have been rendered
    if (this.renderedRequestGroups.length === this.requestGroups.length &&
        renderGroup.requests.length === actualGroup.requests.length) {
      this.loadingRequests = false;
      return;
    } else {
      this.loadingRequests = true;
    }

    const difference = actualLength - renderLength;

    if (difference > threshold) {
      renderGroup.requests =
        actualGroup.requests.slice(0, renderLength + threshold);
    } else {
      renderGroup.requests = actualGroup.requests.slice();
      this.renderNextGroup();
      this.renderMoreRequests(threshold - difference);
    }
  }

  renderNextGroup() {
    if (this.requestGroups.length === this.renderedRequestGroups.length) {
      return;
    }

    const nextRenderedRequestGroup =
        this.requestGroups[this.renderedRequestGroups.length];
    this.renderedRequestGroups.push({
      ...nextRenderedRequestGroup,
      requests: []
    });
  }

  getRequestGroupKey(index: number, requestGroup: RequestGroup) {
    return requestGroup.id;
  }
}
