import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

export function getMergedObjectValue(stream: Observable<any[]>, property: string) {
  return stream.pipe(
    map(objects => {
      const firstValue = objects[0][property];
      return objects.every(r => r[property] === firstValue) ? firstValue : '';
    }));
}
