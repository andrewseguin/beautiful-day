import {Item, ItemsDao, Project, ProjectsDao, Request, RequestsDao} from 'app/season/dao';
import {Query} from 'app/season/utility/search/query';
import {Observable} from 'rxjs';

export interface MatcherContext {
  request?: Request;
  project?: Project;
  item?: Item;
}

export interface AutocompleteContext {
  itemsDao?: ItemsDao;
  requestsDao?: RequestsDao;
  projectsDao?: ProjectsDao;
}

export interface Filter {
  type: string;
  query?: Query;
  isImplicit?: boolean;
}

export interface IFilterMetadata {
  displayName?: string;  // If present, will display as an option to the user
  queryType?: string;
  queryTypeData?: any;
  matcher?: (c: MatcherContext, q: Query) => boolean;
  autocomplete?: (c: AutocompleteContext) => Observable<string[]>;
}
