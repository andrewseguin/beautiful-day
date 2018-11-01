import {Component, Input} from '@angular/core';
import {Project} from 'app/model/project';
import {FormControl, FormGroup} from '@angular/forms';
import {ProjectsDao} from 'app/ui/season/dao';
import {debounceTime} from 'rxjs/operators';
import {MatChipInputEvent} from '@angular/material';

@Component({
  selector: 'editable-project',
  styleUrls: ['editable-project.scss'],
  templateUrl: 'editable-project.html',
})
export class EditableProject {
  lists: {id: string, label: string, values: string[]}[];

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
    });

    this.lists = [];
    this.lists.push({
      id: 'leads',
      label: 'Leads',
      values: (this.project.leads || []).slice()
    });
    this.lists.push({
      id: 'directors',
      label: 'Directors',
      values: (this.project.directors || []).slice()
    });
    this.lists.push({
      id: 'acquisitions',
      label: 'Acquisitions',
      values: (this.project.acquisitions || []).slice()
    });
    this.lists.push({
      id: 'whitelist',
      label: 'Edit Whitelist',
      values: (this.project.whitelist || []).slice()
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
          };

          this.projectsDao.update(this.project.id, update);
        });
  }

  add(list: string[], event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      list.push(value);
    }

    if (event.input) {
      event.input.value = '';
    }

    this.updateLists();
  }

  remove(list: string[], email: string) {
    const index = list.indexOf(email);
    if (index >= 0) {
      list.splice(index, 1);
    }

    this.updateLists();
  }

  updateLists() {
    const update = {};
    this.lists.forEach(list => {
      update[list.id] = list.values;
    });
    this.projectsDao.update(this.project.id, update);
  }
}
