import {NgModule} from '@angular/core';
import {EventDatePipe} from 'app/pipe/event-date.pipe';
import {ItemSearchPipe} from 'app/pipe/item-search.pipe';
import {ReportSearchPipe} from 'app/pipe/report-search.pipe';
import {RequestSortPipe} from 'app/pipe/request-sort.pipe';
import {SafeUrlPipe} from 'app/pipe/safe-url.pipe';
import {SetValuesPipe} from 'app/pipe/set-values.pipe';

@NgModule({
  imports: [],
  declarations: [
    EventDatePipe,
    ItemSearchPipe,
    ReportSearchPipe,
    RequestSortPipe,
    SafeUrlPipe,
    SetValuesPipe,
  ],
  exports: [
    EventDatePipe,
    ItemSearchPipe,
    ReportSearchPipe,
    RequestSortPipe,
    SafeUrlPipe,
    SetValuesPipe,
  ],
})
export class PipeModule { }
