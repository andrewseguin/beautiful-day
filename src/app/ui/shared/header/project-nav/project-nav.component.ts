import {Component, Input} from '@angular/core';
import {PermissionsService} from "../../../../service/permissions.service";

export class ProjectNavLink {
  link: string;
  title: string;
}

@Component({
  selector: 'project-nav',
  templateUrl: './project-nav.component.html',
  styleUrls: ['./project-nav.component.scss']
})
export class ProjectNavComponent {
  projectNavLinks: ProjectNavLink[];

  constructor(private permissionsService: PermissionsService) {}

  @Input('projectId') set id(id: string) {
    if (!id) { this.projectNavLinks = null; return; }

    this.permissionsService.getEditPermissions(id).subscribe(editPermissions => {
      const details = {link: `/project/${id}/details`, title: 'Details'};
      const notes = {link: `/project/${id}/notes`, title: 'Notes'};
      const requests = {link: `/project/${id}/requests`, title: 'Requests'};

      this.projectNavLinks =
          editPermissions.notes ? [details, notes, requests] : [details, requests];
    });
  }
}
