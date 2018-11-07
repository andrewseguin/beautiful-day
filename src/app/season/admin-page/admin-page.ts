import {Component} from '@angular/core';
import {Permissions} from 'app/season/services';

@Component({
  styleUrls: ['admin-page.scss'],
  templateUrl: 'admin-page.html',
})
export class AdminPage {
  constructor(public permissions: Permissions) {}
}
