import {NgModule} from '@angular/core';
import {ItemSearchPipe} from 'app/pipe/item-search.pipe';
import {SafeUrlPipe} from 'app/pipe/safe-url.pipe';

@NgModule({
  imports: [],
  declarations: [
    ItemSearchPipe,
    SafeUrlPipe,
  ],
  exports: [
    ItemSearchPipe,
    SafeUrlPipe,
  ],
})
export class PipeModule { }
