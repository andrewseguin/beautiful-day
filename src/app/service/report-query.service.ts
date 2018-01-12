import {Injectable} from '@angular/core';
import {Item} from 'app/model/item';
import {Request} from 'app/model/request';
import {QueryStage, Query} from 'app/model/report';
import {RequestSortPipe} from 'app/pipe/request-sort.pipe';
import {Project} from 'app/model/project';

@Injectable()
export class ReportQueryService {
  requestSortPipe = new RequestSortPipe();

  constructor() { }

  query(queryStages: QueryStage[],
        requests: Request[],
        items: Item[],
        projects: Project[],
        season: string) {
    let filteredRequests = requests;

    // Filter for only requests of the season
    if (season) {
      const projectsMatchingSeason = new Set<string>();
      projects.forEach(p => p.season === season ? projectsMatchingSeason.add(p.$key) : null);
      filteredRequests = requests.filter(r => projectsMatchingSeason.has(r.project));
    }

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
