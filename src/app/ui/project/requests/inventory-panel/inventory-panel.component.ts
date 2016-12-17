import {
  Component, OnInit, EventEmitter, Output, ViewChild, animate, style,
  transition, state, trigger, AnimationTransitionEvent, ElementRef, Renderer
} from '@angular/core';
import {ItemsService, CategoryGroupCollection} from '../../../../service/items.service';
import {FirebaseObjectObservable} from 'angularfire2';
import {Item} from '../../../../model/item';
import {ProjectsService} from '../../../../service/projects.service';
import {Project} from '../../../../model/project';
import {Params, ActivatedRoute} from '@angular/router';
import {RequestsService} from '../../../../service/requests.service';
import {SubheaderService} from '../../../../service/subheader.service';
import {MediaQueryService} from '../../../../service/media-query.service';
import {SlidingPanelComponent} from './sliding-panel/sliding-panel.component';
import {CreateRequestEvent} from './inventory-panel-item/inventory-panel-item.component';
import {ItemSearchPipe} from '../../../../pipe/item-search.pipe';
import {MdInput} from "@angular/material";

export class RequestAddedResponse {
  item: Item;
  key: string;
}

@Component({
  selector: 'inventory-panel',
  templateUrl: './inventory-panel.component.html',
  styleUrls: ['./inventory-panel.component.scss'],
  animations: [
    trigger('searchContainer', [
      state('open', style({transform: 'translate3d(0, 0, 0)'})),
      state('closed', style({transform: 'translate3d(200px, 0, 0)'})),
      transition('open <=> closed', [
        animate('500ms cubic-bezier(0.35, 0, 0.25, 1)')]
      ),
    ]),
    trigger('searchInput', [
      state('open', style({'opacity': '1'})),
      state('closed', style({'opacity': '0'})),
      transition('open <=> closed', [
        animate('500ms cubic-bezier(0.35, 0, 0.25, 1)')
      ])
    ])
  ]
})
export class InventoryPanelComponent implements OnInit {
  collection: CategoryGroupCollection;
  project: FirebaseObjectObservable<Project>;
  subheaderVisibility: boolean = true;
  items: Item[];

  search: string = '';
  searchState: 'open' | 'closed' = 'closed';
  searchResultCount: number;
  searchLimit: number = 10;
  itemSearch = new ItemSearchPipe();

  @ViewChild('slidingPanel') slidingPanel: SlidingPanelComponent;
  @ViewChild('searchInput') searchInput: MdInput;

  @Output('requestCreated') requestCreated =
      new EventEmitter<RequestAddedResponse>();

  constructor(private route: ActivatedRoute,
              private renderer: Renderer,
              private subheaderService: SubheaderService,
              private mediaQuery: MediaQueryService,
              private itemsService: ItemsService,
              private requestsService: RequestsService,
              private projectsService: ProjectsService) {}

  ngOnInit() {
    this.itemsService.getItems().subscribe(items => this.items = items);

    this.itemsService.getItemsByCategory().subscribe(collection => {
      this.collection = collection;

      // Update the sliding panel if it is open
      if (this.slidingPanel.state == 'open') {
        const category = this.slidingPanel.group.category;
        this.slidingPanel.group = this.collection[category];
      }
    });
    this.route.parent.params.forEach((params: Params) => {
      this.project = this.projectsService.getProject(params['id']);
    });

    this.subheaderService.visibilitySubject.subscribe(visibility => {
      if (!this.mediaQuery.isMobile()) {
        this.subheaderVisibility = false;
      } else {
        this.subheaderVisibility = visibility;
      }
    })
  }

  getCategories(): string[] {
    return this.collection ? Object.keys(this.collection) : [];
  }

  createRequest(event: CreateRequestEvent) {
    this.project.first().subscribe(project => {
      this.requestsService.addRequest(project, event.item, event.quantity)
        .then(response => {
          this.requestCreated.emit({key: response.getKey(), item: event.item});
        });
    })
  }

  openSlidingPanel(category: string) {
    this.slidingPanel.open();
    this.slidingPanel.group = this.collection[category];
  }

  reset() {
    this.slidingPanel.close();
  }

  getItems(): Item[] {
    const itemsSearchResult = this.itemSearch.transform(this.items, this.search);
    this.searchResultCount = itemsSearchResult.length;
    return itemsSearchResult.slice(0, this.searchLimit);
  }

  getItemKey(item: Item): string {
    return item.$key;
  }

  searchContainerAnimationDone(e: AnimationTransitionEvent) {
    if (e.toState == 'open') { this.searchInput.focus(); }
  }
}
