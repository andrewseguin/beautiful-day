import {ItemSearchTransformer} from 'app/utility/search/item-search-transformer';
import {Request, Item, Project} from 'app/ui/season/dao';

export class RequestSearchTransformer {
  static transform(request: Request, item: Item, project: Project): string {
    const requestStr = request.dropoff + request.note + request.quantity +
                       request.tags + project.name + request.purchaser;
    const itemStr = ItemSearchTransformer.transform(item);

    return (requestStr + itemStr).toLowerCase();
  }
}
