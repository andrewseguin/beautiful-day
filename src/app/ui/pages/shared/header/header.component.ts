import {Component, Input} from '@angular/core';
import {HeaderService} from 'app/service/header.service';
import {MatSidenav} from '@angular/material';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input() sidenav: MatSidenav;

  constructor(public titleService: HeaderService) { }

  leftButtonClicked() {
    if (this.titleService.goBack) {
      this.titleService.goBack();
    } else {
      this.sidenav.open();
    }
  }
}
