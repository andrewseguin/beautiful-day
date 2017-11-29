import {QueryStage} from 'app/model/report';

export class QueryDisplay {
  static get(queryStages: QueryStage[]): string {
    return queryStages.map(queryStage => {
      return ` ${queryStage.querySet.map(query => query.queryString).join(' OR ')} `;
    }).join(' AND ').trim();
  }
}
