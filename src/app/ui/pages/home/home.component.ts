import {Component} from '@angular/core';
import {PermissionsService} from 'app/service/permissions.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  show2017Projects = false;
  canViewPastProjects = this.permissionsService.canViewPastProjects();

  constructor(public permissionsService: PermissionsService) { }
}
