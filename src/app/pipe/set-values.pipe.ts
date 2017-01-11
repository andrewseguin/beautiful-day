import {Pipe, PipeTransform} from "@angular/core";

@Pipe({name: 'setValues'})
export class SetValuesPipe implements PipeTransform {
  transform(value: Set<any>): any[] {
    return Array.from(value);
  }
}
