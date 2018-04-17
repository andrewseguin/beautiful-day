import {Component} from '@angular/core';
import {HeaderService} from 'app/service/header.service';
import {PermissionsService} from 'app/service/permissions.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  show2017Projects = false;
  canViewPastProjects = this.permissionsService.canViewPastProjects();

  constructor(headerService: HeaderService, public permissionsService: PermissionsService) {
    headerService.title = 'Home';
  }
}
