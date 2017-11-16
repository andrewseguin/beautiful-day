import {DisplayOptions} from "./display-options";

export type QueryType = 'any';

export interface Query {
  queryString?: string,
  type?: QueryType
}

export interface QueryStage {
  querySet?: Query[];
  exclude?: boolean;
}

export interface Report {
  $key?: string;
  name?: string;
  displayOptions?: DisplayOptions;
  queryStages?: QueryStage[];
  createdBy?: string;
  createdDate?: string;
  modifiedBy?: string;
  modifiedDate?: string;
}
