import {Injectable} from '@angular/core';
import {Item} from '../model/item';
import {Request} from '../model/request';
import {QueryStage, Query} from '../model/report';
import {RequestSortPipe} from '../pipe/request-sort.pipe';
import {Project} from '../model/project';

@Injectable()
export class ReportQueryService {
  requestSortPipe = new RequestSortPipe();

  constructor() { }

  query(queryStages: QueryStage[],
        requests: Request[],
        items: Item[],
        projects: Project[]) {
    let filteredRequests = requests;
    queryStages.forEach(queryStage => {
      let requestSet = new Set<Request>();
      queryStage.querySet.forEach(query => {
        let requestArray = this.requestSortPipe.transform(filteredRequests,
          'request added', false, this.transformQuery(query), items, projects);
        requestArray.forEach(request => requestSet.add(request));
      });

      filteredRequests = [];
      requestSet.forEach(request => filteredRequests.push(request));
    });

    return filteredRequests;
  }

  transformQuery(query: Query): string {
    // Remove spaces
    let transformedQuery = query.queryString.replace(/ /g, '');

    // Add the type prefix
    if (query.type != 'any') { transformedQuery = `[${query.type}]:${transformedQuery}`; }

    return transformedQuery;
  }

}
