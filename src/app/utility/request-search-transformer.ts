import {ItemSearchTransformer} from "./item-search-transformer";
import {Project} from "../model/project";
import {Item} from "../model/item";
import {Request} from "../model/request";

export class RequestSearchTransformer {
  static transform(request: Request, item: Item, project: Project): string {

    const dropoff = `[dropoff]:${request.dropoff}`;
    const note = `[note]:${request.note}`;
    const quantity = `[quantity]:${request.quantity}`;
    const tags = request.tags ? request.tags.split(',').map(tag => `[tag]:${tag}`) : '';
    const projectName = `[project]:${project.name}`;
    const purchaser = `[purchaser]:${request.purchaser}`;
    const isPurchased = `[isPurchased]:${!!request.isPurchased}`;
    const isApproved = `[isApproved]:${!!request.isApproved}`;

    const requestStr = dropoff + note + quantity + tags + projectName + purchaser + isPurchased + isApproved;
    const itemStr = ItemSearchTransformer.transform(item);

    return (requestStr + itemStr).replace(/ /g, '').toLowerCase();
  }
}