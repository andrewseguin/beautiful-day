import {Component, OnInit, EventEmitter, ViewChild, Output, ElementRef} from "@angular/core";
import {ItemsService, CategoryGroupCollection} from "../../../../../service/items.service";
import {FirebaseObjectObservable} from "angularfire2";
import {Item} from "../../../../../model/item";
import {ProjectsService} from "../../../../../service/projects.service";
import {Project} from "../../../../../model/project";
import {Params, ActivatedRoute} from "@angular/router";
import {SubheaderService} from "../../../../../service/subheader.service";
import {MediaQueryService} from "../../../../../service/media-query.service";
import {SlidingPanelComponent} from "./sliding-panel/sliding-panel.component";

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

  search: string = '';

  @ViewChild('slidingPanel') slidingPanel: SlidingPanelComponent;

  @Output('closeSidenav') closeSidenav = new EventEmitter<void>();

  constructor(private route: ActivatedRoute,
              private subheaderService: SubheaderService,
              private mediaQuery: MediaQueryService,
              private itemsService: ItemsService,
              private projectsService: ProjectsService) {}

  ngOnInit() {
    this.itemsService.getItemsByCategory().subscribe(collection => {
      this.collection = collection;
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
    });
  }

  getCategories(): string[] {
    return this.collection ? Object.keys(this.collection) : [];
  }

  openSlidingPanel(category: string) {
    this.slidingPanel.open();
    this.slidingPanel.category = category;
  }

  reset() {
    this.slidingPanel.close();
  }
}
