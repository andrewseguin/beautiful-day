import {Component, OnInit, EventEmitter, Output} from '@angular/core';
import {ItemsService} from "../../../../service/items.service";
import {FirebaseListObservable, FirebaseObjectObservable} from "angularfire2";
import {Item} from "../../../../model/item";
import {ProjectsService} from "../../../../service/projects.service";
import {Project} from "../../../../model/project";
import {Params, ActivatedRoute} from "@angular/router";
import {RequestsService} from "../../../../service/requests.service";
import {SubheaderService} from "../../../../service/subheader.service";
import {MediaQueryService} from "../../../../service/media-query.service";

@Component({
  selector: 'inventory-panel',
  templateUrl: 'inventory-panel.component.html',
  styleUrls: ['inventory-panel.component.scss'],
})
export class InventoryPanelComponent implements OnInit {
  items: FirebaseListObservable<Item[]>;
  project: FirebaseObjectObservable<Project>;
  subheaderVisibility: boolean = true;

  @Output('itemAdded') itemAdded = new EventEmitter();

  constructor(private route: ActivatedRoute,
              private subheaderService: SubheaderService,
              private mediaQuery: MediaQueryService,
              private itemsService: ItemsService,
              private requestsService: RequestsService,
              private projectsService: ProjectsService) { }

  ngOnInit() {
    this.items = this.itemsService.getItems();
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

  addItem(item: Item) {
    this.project.first().subscribe(project => {
      this.requestsService.addRequest(project, item);
      this.itemAdded.emit(item);
    })
  }

}
