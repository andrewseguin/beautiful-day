import {ItemSearchTransformer} from '../../../../../utility/search/item-search-transformer';
import {Project} from 'app/model/project';
import {Item} from 'app/model/item';
import {Request} from 'app/model/request';

export class RequestSearchTransformer {
  static transform(request: Request, item: Item, project: Project): string {
    const requestStr = request.dropoff + request.note + request.quantity +
                       request.tags + project.name + request.purchaser;
    const itemStr = ItemSearchTransformer.transform(item);

    return (requestStr + itemStr).toLowerCase();
  }
}
