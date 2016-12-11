import {Component, Input} from '@angular/core';

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

  @Input('projectId') set id(id: string) {
    if (!id) { this.projectNavLinks = null; return; }

    this.projectNavLinks = [
      {link: `project/${id}/details`, title: 'Details'},
      {link: `project/${id}/notes`, title: 'Notes'},
      {link: `project/${id}/requests`, title: 'Requests'}
    ];
  }
}
