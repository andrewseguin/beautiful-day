import { Component, OnInit } from '@angular/core';
import {HeaderService} from '../../../service/header.service';
import {ActivatedRoute, Params} from '@angular/router';
import {MediaQueryService} from "../../../service/media-query.service";
import {Request} from "../../../model/request";
import {RequestsService} from "../../../service/requests.service";
import {RequestSortPipe} from '../../../pipe/request-sort.pipe';
import {Sort} from '../../shared/requests-list/requests-group/requests-group.component';
import {ProjectsService} from '../../../service/projects.service';
import {ItemsService} from '../../../service/items.service';
import {Item} from '../../../model/item';
import {Project} from '../../../model/project';

export interface QueryStage {
  querySet: string[];
}

@Component({
  selector: 'reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.scss']
})
export class ReportingComponent implements OnInit {
  requestSortPipe = new RequestSortPipe();
  reportId: string;
  items: Item[] = [];
  projects: Project[] = [];
  requests: Request[] = [];
  filteredRequests: Request[] = [];
  queryStages: QueryStage[] = [{querySet: ['']}];

  arbitrarySort: Sort = 'request added';

  constructor(private route: ActivatedRoute,
              private mediaQuery: MediaQueryService,
              private requestsService: RequestsService,
              private itemsService: ItemsService,
              private projectsService: ProjectsService,
              private headerService: HeaderService) { }

  ngOnInit() {
    this.headerService.title = 'Reporting';
    this.route.params.subscribe((params: Params) => {
      this.reportId = params['id'];
    });

    this.requestsService.getAllRequests().subscribe(requests => {
      this.requests = requests; this.performQuery();
    });

    this.itemsService.getItems().subscribe(items => {
      this.items = items; this.performQuery();
    });

    this.projectsService.getProjects().subscribe(projects => {
      this.projects= projects; this.performQuery();
    });
  }

  removeQuery(queryStageIndex: number, querySet: string[], queryIndex: number) {
    // If the query set has more than one query, just remove this one query.
    if (querySet.length > 1) {
      querySet.splice(queryIndex, 1);
    } else {
      // This is the last query of the stage. If there is only one stage, then return. Otherwise,
      // remove the stage.
      if (this.queryStages.length != 1) {
        // Remove the query stage since the last query is being removed.
        this.queryStages.splice(queryStageIndex, 1);
      }
    }

    this.performQuery();
  }

  hideQueries(): boolean {
    return this.mediaQuery.isMobile();
  }

  performQuery() {
    if (!this.items || !this.projects) { return; }

    this.filteredRequests = this.requests;
    for (let queryStage of this.queryStages) {
      let requestSet = new Set<Request>();
      for (let query of queryStage.querySet) {
        query = query.replace(/ /g, ''); // Remove spaces

        // Get the results, either add them as additions or exclusions
        let requestArray = this.requestSortPipe.transform(this.filteredRequests,
            this.arbitrarySort, query, this.items, this.projects);
        requestArray.forEach(request => requestSet.add(request));
      }

      this.filteredRequests = [];
      requestSet.forEach(request => this.filteredRequests.push(request));
    }
  }

  trackByIndex(i: number) { return i; }
}
