import {map} from 'rxjs/operators';

export const sortByDateCreated = map((list: any[]) => {
  return list ? list.sort((a, b) => a.dateCreated > b.dateCreated ? 1 : -1) : null;
});
