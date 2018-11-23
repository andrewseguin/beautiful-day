import {Component} from '@angular/core';
import {Permissions} from 'app/season/services';
import {isMobile} from 'app/utility/media-matcher';

@Component({
  selector: 'admin-page',
  styleUrls: ['admin-page.scss'],
  templateUrl: 'admin-page.html',
})
export class AdminPage {
  isMobile = isMobile;
  constructor(public permissions: Permissions) {}
}
