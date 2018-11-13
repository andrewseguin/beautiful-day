import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  styleUrls: ['home-page.scss'],
  templateUrl: 'home-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePage {
  constructor() {}
}
