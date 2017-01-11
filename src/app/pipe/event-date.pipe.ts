import { Pipe, PipeTransform } from '@angular/core';
import {DatePipe} from "@angular/common";

@Pipe({
  name: 'eventDate'
})
export class EventDatePipe implements PipeTransform {
  datePipe = new DatePipe('en-US');

  transform(date: string): string {
    return this.datePipe.transform(new Date(date), 'longDate');
  }
}
