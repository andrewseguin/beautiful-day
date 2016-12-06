import { Component, OnInit } from '@angular/core';
import {Project} from "../../../model/project";
import {MdDialogRef} from "@angular/material";
import {ProjectsService} from "../../../service/projects.service";

@Component({
  selector: 'app-delete-project',
  templateUrl: 'delete-project.component.html',
  styleUrls: ['delete-project.component.scss']
})
export class DeleteProjectComponent {
  project: Project;
  deleteCheck: string = '';

  constructor(private dialogRef: MdDialogRef<DeleteProjectComponent>,
              private projectsService: ProjectsService) { }

  close() {
    this.dialogRef.close();
  }

  deleteProject() {
    if (this.deleteCheck.toLowerCase().trim() != 'delete') return;

    this.projectsService.deleteProject(this.project.$key);
    this.close();
  }
}
