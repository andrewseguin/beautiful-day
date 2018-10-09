import {ChangeDetectionStrategy, Component} from '@angular/core';
import {PermissionsService} from 'app/service/permissions.service';

@Component({
  selector: 'app-home',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsComponent {
  show2017Projects = false;

  constructor(public permissionsService: PermissionsService) {}
}
