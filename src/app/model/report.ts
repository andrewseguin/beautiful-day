export type QueryType = 'any';

export interface Query {
  queryString: string,
  type: QueryType
}

export interface QueryStage {
  querySet: Query[];
  exclude: boolean;
}

export class Report {
  $key?: string;
  name: string;
  queryStages: QueryStage[];
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
}
