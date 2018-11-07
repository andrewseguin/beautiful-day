import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  styleUrls: ['help-page.scss'],
  templateUrl: 'help-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HelpPage {
  constructor() {}
}
