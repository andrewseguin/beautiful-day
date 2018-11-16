import {Query} from 'app/season/services/requests-renderer/query';

export type FilterType = 'project' | 'purchaser' | 'dropoffDate' |
  'requestCost' | 'projectKey' | 'itemCost' |
  'dropoffLocation' | 'season';

export interface IFilterMetadata {
  displayName?: string;  // If present, will display as an option to the user
  queryType?: string;
}

export const FilterMetadata = new Map<FilterType, IFilterMetadata>([
  ['project', {
    displayName: 'Project',
    queryType: 'input',
  }],
  ['projectKey', {
    queryType: 'input',
  }],
  ['purchaser', {
    displayName: 'Purchaser',
    queryType: 'input',
  }],
  ['requestCost', {
    displayName: 'Request Cost',
    queryType: 'numberEquality',
  }],
  ['itemCost', {
    displayName: 'Item Cost',
    queryType: 'numberEquality',
  }],
  ['dropoffDate', {
    displayName: 'Dropoff Date',
    queryType: 'dateEquality',
  }],
  ['dropoffLocation', {
    displayName: 'Dropoff Location',
    queryType: 'input',
  }],
]);

export interface Filter {
  type: FilterType;
  query?: Query;
  isImplicit?: boolean;
}
