import {Item, Project, Request} from 'app/season/dao';

/** Returns a lower-cased string that contains the searchable tokens of Item. */
export function tokenizeItem(item: Item) {
  const itemStr = (item.name || '') +
      (item.categories || '') +
      (item.url || '') +
      (item.cost || '') +
      (item.keywords || '');
  return itemStr.toLowerCase();
}

/** Returns a lower-cased string that contains the searchable tokens of Request. */
export function tokenizeRequest(request: Request, item: Item, project: Project): string {
  const projectStr = project.name;
  const requestStr = request.dropoff + request.note + request.quantity +
    request.tags + request.purchaser;
  const itemStr = tokenizeItem(item);

  return (projectStr + requestStr + itemStr).toLowerCase();
}

