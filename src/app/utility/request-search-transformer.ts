import {ItemSearchTransformer} from "./item-search-transformer";
import {Project} from "../model/project";
import {Item} from "../model/item";
import {Request} from "../model/request";

export class RequestSearchTransformer {
  static transform(request: Request, item: Item, project: Project): string {

    const requestStr = request.dropoff + (request.note || '') + request.quantity + request.tags + project.name;
    const itemStr = ItemSearchTransformer.transform(item);

    return (requestStr + itemStr).replace(/ /g, '').toLowerCase();
  }
}
