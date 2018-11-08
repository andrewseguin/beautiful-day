import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {Header} from 'app/season/services/header';
import {MatSidenav} from '@angular/material';

@Component({
  selector: 'season-header',
  templateUrl: 'season-header.html',
  styleUrls: ['season-header.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SeasonHeader {
  @Input() sidenav: MatSidenav;

  constructor(public header: Header, private cd: ChangeDetectorRef) { }

  leftButtonClicked() {
    if (this.header.goBack) {
      this.header.goBack();
    } else {
      this.sidenav.open();
    }
  }

  check() {
    this.cd.markForCheck();
  }
}
