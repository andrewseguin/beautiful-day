export interface QueryStage {
  querySet: string[];
}

export class Report {
  $key?: string;
  name: string;
  queryStages: QueryStage[];
}
