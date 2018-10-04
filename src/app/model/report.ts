export type QueryType = 'any';

export interface Query {
  queryString?: string;
  type?: QueryType;
}

export interface QueryStage {
  querySet?: Query[];
  exclude?: boolean;
}

export interface Report {
  $key?: string;
  name?: string;
  queryStages?: QueryStage[];
  createdBy?: string;
  createdDate?: string;
  modifiedBy?: string;
  modifiedDate?: string;
  season?: string;
}
