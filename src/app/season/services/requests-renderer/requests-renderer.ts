import {Injectable} from '@angular/core';
import {RequestGroup, RequestGrouping} from './request-grouping';
import {BehaviorSubject, combineLatest, Subscription} from 'rxjs';
import {RequestRendererOptions} from './request-renderer-options';
import {startWith} from 'rxjs/operators';
import {RequestFilterer} from './request-filterer';
import {RequestSorter} from './request-sorter';
import {Item, ItemsDao, Project, ProjectsDao, Request, RequestsDao} from 'app/season/dao';
import {tokenizeRequest} from 'app/season/utility/tokenize';

@Injectable()
export class RequestsRenderer {
  options: RequestRendererOptions = new RequestRendererOptions();

  // Starts as null as a signal that no requests have been processed.
  requestGroups = new BehaviorSubject<RequestGroup[] | null>(null);

  private initSubscription: Subscription;

  constructor(private requestsDao: RequestsDao,
              private itemsDao: ItemsDao,
              private projectsDao: ProjectsDao) { }

  ngOnDestroy() {
    this.initSubscription.unsubscribe();
  }

  initialize() {
    if (this.initSubscription) {
      throw new Error('Already been initialized');
    }

    const data: any[] = [
      this.requestsDao.list,
      this.itemsDao.list,
      this.projectsDao.list,
      this.options.changed.pipe(startWith(null)),
    ];

    this.initSubscription = combineLatest(data).subscribe(result => {
      const requests = result[0] as Request[];
      const items = result[1] as Item[];
      const projects = result[2] as Project[];

      if (!requests || !items || !projects) {
        return [];
      }

      console.time('compute');

      const itemMap = new Map<string, Item>();
      items.forEach(item => itemMap.set(item.id, item));

      const projectMap = new Map<string, Project>();
      projects.forEach(project => projectMap.set(project.id, project));

      // Filter
      const requestFilterer = new RequestFilterer(this.options, projectMap, itemMap);
      let filteredRequests = requestFilterer.filter(requests);

      // Search
      const search = this.options.search;
      const searchedRequests = !search ? filteredRequests : filteredRequests.filter(request => {
        const item = itemMap.get(request.item) || {};
        const project = projectMap.get(request.project) || {};
        return this.requestMatchesSearch(request, item, project, search);
      });

      // Group
      const grouper = new RequestGrouping(items, searchedRequests, projects);
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
    const requestStr = tokenizeRequest(request, item, project);
    return requestStr.indexOf(token.toLowerCase()) != -1;
  }
}
