import {Item, Project, Request} from 'app/season/dao';
import {RequestRendererOptions} from './request-renderer-options';
import {FilterMetadata} from './request-filter-metadata';
import {MatcherContext} from 'app/season/utility/search/filter';

export class RequestFilterer {
  constructor(private options: RequestRendererOptions,
              private projectMap: Map<string, Project>,
              private itemMap: Map<string, Item>) {}

  filter(requests: Request[]) {
    return requests.filter(request => {
      return this.options.filters.every(filter => {
        if (!filter.query) {
          return true;
        }

        const context: MatcherContext = {
          request: request,
          project: this.projectMap.get(request.project),
          item: this.itemMap.get(request.item),
        };

        return FilterMetadata.get(filter.type).matcher(context, filter.query);
      });
    });
  }
}
