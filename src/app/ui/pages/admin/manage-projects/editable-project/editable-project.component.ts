import {Component, Input} from '@angular/core';
import {Project} from 'app/model/project';
import {FormControl, FormGroup} from '@angular/forms';
import {ProjectsDao} from 'app/service/dao';
import {debounceTime} from 'rxjs/operators';

@Component({
  selector: 'editable-project',
  styleUrls: ['editable-project.component.scss'],
  templateUrl: 'editable-project.component.html',
})
export class EditableProjectComponent {
  @Input() project: Project;

  projectForm: FormGroup;

  constructor(private projectsDao: ProjectsDao) {}

  ngOnInit() {
    this.projectForm = new FormGroup({
      name: new FormControl(this.project.name),
      description: new FormControl(this.project.description),
      location: new FormControl(this.project.location),
      budget: new FormControl(this.project.budget),
      receiptsFolder: new FormControl(this.project.receiptsFolder),
      leads: new FormControl(this.project.leads),
      directors: new FormControl(this.project.directors),
      acquisitions: new FormControl(this.project.acquisitions),
    });

    this.projectForm.valueChanges
        .pipe(debounceTime(500))
        .subscribe(value => {
          const update: Project = {
            name: value.name,
            description: value.description,
            location: value.location,
            budget: value.budget,
            receiptsFolder: value.receiptsFolder,
            leads: value.leads,
            directors: value.directors,
            acquisitions: value.acquisitions
          };

          this.projectsDao.update(this.project.id, update);
        });
  }

}
