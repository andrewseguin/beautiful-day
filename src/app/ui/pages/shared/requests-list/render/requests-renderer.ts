import {Injectable} from '@angular/core';
import {
  RequestGroup,
  RequestGrouping
} from 'app/ui/pages/shared/requests-list/render/request-grouping';
import {RequestsService} from 'app/service/requests.service';
import {ItemsService} from 'app/service/items.service';
import {ProjectsService} from 'app/service/projects.service';
import {combineLatest, Subscription} from 'rxjs';
import {Item} from 'app/model/item';
import {Project} from 'app/model/project';
import {Request} from 'app/model/request';
import {Subject} from 'rxjs/Rx';
import {RequestSearchTransformer} from 'app/utility/search/request-search-transformer';
import {RequestSortPipe} from 'app/pipe/request-sort.pipe';
import {
  FilterProjectKeyQuery,
  FilterProjectQuery,
  RequestRendererOptions
} from 'app/ui/pages/shared/requests-list/render/request-renderer-options';
import {startWith} from 'rxjs/operators';

@Injectable()
export class RequestsRenderer {
  options: RequestRendererOptions = new RequestRendererOptions();

  requestGroups = new Subject<RequestGroup[]>();

  private initSubscription: Subscription;

  constructor(private requestsService: RequestsService,
              private itemsService: ItemsService,
              private projectsService: ProjectsService) { }

  ngOnDestroy() {
    this.initSubscription.unsubscribe();
  }

  initialize() {
    if (this.initSubscription) {
      throw new Error('Already been initialized');
    }

    const data: any[] = [
      this.requestsService.requests,
      this.itemsService.items,
      this.projectsService.projects,
      this.options.changed.pipe(startWith(null)),
    ];

    this.initSubscription = combineLatest(data).subscribe(result => {
      console.time('compute');
      const requests = result[0] as Request[];
      const items = result[1];
      const projects = result[2];

      const itemMap = new Map<string, Item>();
      items.forEach(item => itemMap.set(item.$key, item));

      const projectMap = new Map<string, Project>();
      projects.forEach(project => projectMap.set(project.$key, project));

      // Filters
      console.time('filter');
      let filteredRequests = requests.filter(request => {
        return this.options.filters.every(filter => {
          switch (filter.type) {
            case 'project': {
              const query = filter.query as FilterProjectQuery;
              if (!query || !query.project) {
                return true;
              }

              const projectName = projectMap.get(request.project).name.toLowerCase();
              const queryProjectName = query.project.toLowerCase();
              return projectName.indexOf(queryProjectName) != -1;
            }
            case 'projectKey': {
              const query = filter.query as FilterProjectKeyQuery;
              return !query || !query.key || request.project === query.key;
            }
          }
        });
      });
      console.timeEnd('filter');

      // Perform search
      console.time('search');
      const filter = this.options.search;
      const searchedRequests = filteredRequests.filter(request => {
        const item = itemMap.get(request.item);
        const project = projectMap.get(request.project);
        return this.requestMatchesSearch(request, item, project, filter);
      });
      console.timeEnd('search');

      // Construct groups
      console.time('group');
      const grouper = new RequestGrouping(items, searchedRequests);
      let requestGroups = grouper.getGroup(this.options.grouping);
      requestGroups = requestGroups.sort((a, b) => a.title < b.title ? -1 : 1);
      console.timeEnd('group');

      // Sort lists
      console.time('sort');
      const requestSortPipe = new RequestSortPipe();
      requestGroups.forEach(group => {
        const sort = this.options.sorting;
        const sortFn = requestSortPipe.getSortFunction(sort, itemMap);
        group.requests = group.requests.sort(sortFn);

        if (this.options.reverseSort) {
          group.requests = group.requests.reverse();
        }
      });
      console.timeEnd('sort');

      this.requestGroups.next(requestGroups);
      console.timeEnd('compute');
    });
  }

  requestMatchesSearch(request: Request, item: Item, project: Project, token: string) {
    const requestStr = RequestSearchTransformer.transform(request, item, project);
    return requestStr.indexOf(token.toLowerCase()) != -1;
  }
}
