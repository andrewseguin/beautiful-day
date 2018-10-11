import {Injectable} from '@angular/core';
import {
  RequestGroup,
  RequestGrouping
} from 'app/ui/pages/shared/requests-list/render/request-grouping';
import {RequestsService} from 'app/service/requests.service';
import {ItemsService} from 'app/service/items.service';
import {ProjectsService} from 'app/service/projects.service';
import {BehaviorSubject, combineLatest, Subscription} from 'rxjs';
import {Item} from 'app/model/item';
import {Project} from 'app/model/project';
import {Request} from 'app/model/request';
import {RequestSearchTransformer} from 'app/utility/search/request-search-transformer';
import {RequestRendererOptions} from 'app/ui/pages/shared/requests-list/render/request-renderer-options';
import {startWith} from 'rxjs/operators';
import {RequestFilterer} from 'app/ui/pages/shared/requests-list/render/request-filterer';
import {RequestSorter} from 'app/ui/pages/shared/requests-list/render/request-sorter';

@Injectable()
export class RequestsRenderer {
  options: RequestRendererOptions = new RequestRendererOptions();

  requestGroups = new BehaviorSubject<RequestGroup[]>([]);

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
      const requests = result[0] as Request[];
      const items = result[1] as Item[];
      const projects = result[2] as Project[];

      if (!requests.length || !items.length || !projects.length) {
        return [];
      }

      console.time('compute');

      const itemMap = new Map<string, Item>();
      items.forEach(item => itemMap.set(item.$key, item));

      const projectMap = new Map<string, Project>();
      projects.forEach(project => projectMap.set(project.$key, project));

      // Filter
      const requestFilterer = new RequestFilterer(this.options, projectMap, itemMap);
      let filteredRequests = requestFilterer.filter(requests);

      // Search
      const search = this.options.search;
      const searchedRequests = !search ? filteredRequests : filteredRequests.filter(request => {
        const item = itemMap.get(request.item);
        const project = projectMap.get(request.project);
        return this.requestMatchesSearch(request, item, project, search);
      });

      // Group
      const grouper = new RequestGrouping(items, searchedRequests);
      let requestGroups = grouper.getGroup(this.options.grouping);
      requestGroups = requestGroups.sort((a, b) => a.title < b.title ? -1 : 1);

      // Sort
      const requestSortPipe = new RequestSorter();
      requestGroups.forEach(group => {
        const sort = this.options.sorting;
        const sortFn = requestSortPipe.getSortFunction(sort, itemMap);
        group.requests = group.requests.sort(sortFn);

        if (this.options.reverseSort) {
          group.requests = group.requests.reverse();
        }
      });

      this.requestGroups.next(requestGroups);
      console.timeEnd('compute');
    });
  }

  requestMatchesSearch(request: Request, item: Item, project: Project, token: string) {
    const requestStr = RequestSearchTransformer.transform(request, item, project);
    return requestStr.indexOf(token.toLowerCase()) != -1;
  }
}
