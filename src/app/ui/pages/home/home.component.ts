import {ChangeDetectionStrategy, Component} from '@angular/core';
import {PermissionsService} from 'app/service/permissions.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  show2017Projects = false;
  canViewPastProjects = this.permissionsService.canViewPastProjects();

  constructor(private permissionsService: PermissionsService) { }
}
