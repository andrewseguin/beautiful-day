import { Component, OnInit } from '@angular/core';
import {MdDialogRef} from "@angular/material";
import {RequestsService} from "../../../service/requests.service";
import {Project} from "../../../model/project";
import {ProjectsService} from "../../../service/projects.service";

export type EditType = 'name' | 'location' | 'description' | 'managers' | 'director';

@Component({
  selector: 'edit-project',
  templateUrl: 'edit-project.component.html',
  styleUrls: ['edit-project.component.scss']
})
export class EditProjectComponent implements OnInit {
  project: Project;
  name: string;
  description: string;
  location: string;
  managers: string[];
  director: string;
  type: EditType;

  constructor(private dialogRef: MdDialogRef<EditProjectComponent>,
              private projectsService: ProjectsService) { }

  ngOnInit(): void {
    this.name = this.project.name;
    this.description = this.project.description;
    this.location = this.project.location;
    this.managers = [''] || this.project.managers.split(',');
    this.director = this.project.director;
  }

  close(): void {
    this.dialogRef.close();
  }

  save(): void {
    let update = {};

    switch (this.type) {
      case 'name':
        update = {name: this.name}; break;
      case 'location':
        update = {location: this.location}; break;
      case 'description':
        update = {description: this.description}; break;
      case 'managers':
        const managersArray = [];
        this.managers.forEach(manager => managersArray.push(manager));
        update = {managers: managersArray.join()};
        break;
      case 'description':
        update = {description: this.description}; break;
    }

    this.projectsService.update(this.project.$key, update);
    this.close();
  }

  adjustHeight(e: KeyboardEvent): void {
    if (e.keyCode == 13 || e.key == 'Enter') { this.save(); return; }

    const target = <HTMLElement>e.target;
    target.style.height = '1px';
    target.style.height = target.scrollHeight + 'px'
  }

  managerTrackBy(i: number): number {
    return i;
  }
}
