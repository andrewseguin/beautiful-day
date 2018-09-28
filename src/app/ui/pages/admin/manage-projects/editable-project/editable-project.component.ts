import {Component, Input} from '@angular/core';
import {Project} from 'app/model/project';

@Component({
  selector: 'editable-project',
  styleUrls: ['editable-project.component.scss'],
  templateUrl: 'editable-project.component.html',
})
export class EditableProjectComponent {
  @Input() project: Project;
}
