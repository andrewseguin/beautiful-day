import {Component, Input} from '@angular/core';

@Component({
  selector: 'project-nav',
  templateUrl: './project-nav.component.html',
  styleUrls: ['./project-nav.component.scss']
})
export class ProjectNavComponent {
  @Input('projectId') id;

  constructor() { }
}
