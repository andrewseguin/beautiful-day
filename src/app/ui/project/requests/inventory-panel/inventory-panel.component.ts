import {Component, OnInit, EventEmitter, Output, ViewChild} from "@angular/core";
import {ItemsService, CategoryGroupCollection} from "../../../../service/items.service";
import {FirebaseObjectObservable} from "angularfire2";
import {Item} from "../../../../model/item";
import {ProjectsService} from "../../../../service/projects.service";
import {Project} from "../../../../model/project";
import {Params, ActivatedRoute} from "@angular/router";
import {RequestsService} from "../../../../service/requests.service";
import {SubheaderService} from "../../../../service/subheader.service";
import {MediaQueryService} from "../../../../service/media-query.service";
import {SlidingPanelComponent} from "./sliding-panel/sliding-panel.component";
import {ItemSearchPipe} from "../../../../pipe/item-search.pipe";

@Component({
  selector: 'inventory-panel',
  templateUrl: './inventory-panel.component.html',
  styleUrls: ['./inventory-panel.component.scss']
})
export class InventoryPanelComponent implements OnInit {
  collection: CategoryGroupCollection;
  project: FirebaseObjectObservable<Project>;
  subheaderVisibility: boolean = true;
  items: Item[];

  _search: string = '';
  searchResult: Item[] = [];
  itemSearch = new ItemSearchPipe();

  @ViewChild('slidingPanel') slidingPanel: SlidingPanelComponent;

  @Output('closeSidenav') closeSidenav = new EventEmitter<void>();

  constructor(private route: ActivatedRoute,
              private subheaderService: SubheaderService,
              private mediaQuery: MediaQueryService,
              private itemsService: ItemsService,
              private projectsService: ProjectsService) {}

  set search(s: string) {
    this._search = s;
    this.updateSearchResults();
  }
  get search(): string { return this._search; }

  ngOnInit() {
    this.itemsService.getItems().subscribe(items => {
      this.items = items;
      this.updateSearchResults();
    });

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

  updateSearchResults() {
    if (!this._search) {
      this.searchResult = [];
      return;
    }

    // Update the search results in case a new item matches
    this.searchResult = this.itemSearch.transform(this.items, this._search);
  }

  getCategories(): string[] {
    return this.collection ? Object.keys(this.collection) : [];
  }

  openSlidingPanel(category: string) {
    this.slidingPanel.open();
    this.slidingPanel.group = this.collection[category];
  }

  reset() {
    this.slidingPanel.close();
  }

  getItemKey(item: Item): string {
    return item.$key;
  }
}
