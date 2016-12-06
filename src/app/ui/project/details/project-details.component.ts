import { Component, OnInit } from '@angular/core';
import {Params, ActivatedRoute} from "@angular/router";
import {ProjectsService} from "../../../service/projects.service";
import {Request} from "../../../model/request";
import {FirebaseListObservable} from "angularfire2";
import {Project} from "../../../model/project";
import {MdDialog} from "@angular/material";
import {EditProjectComponent, EditType} from "../../dialog/edit-project/edit-project.component";
import {DeleteProjectComponent} from "../../dialog/delete-project/delete-project.component";

@Component({
  selector: 'project-details',
  templateUrl: 'project-details.component.html',
  styleUrls: ['project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit {
  project: Project;
  requests: FirebaseListObservable<Request[]>;

  constructor(private route: ActivatedRoute,
              private mdDialog: MdDialog,
              private projectsService: ProjectsService) { }

  ngOnInit() {
    this.route.parent.params.forEach((params: Params) => {
      this.projectsService.getProject(params['id']).subscribe(project => {
        this.project = project;
      });
    });
  }

  edit(type: EditType) {
    const dialogRef = this.mdDialog.open(EditProjectComponent);
    dialogRef.componentInstance.project = this.project;
    dialogRef.componentInstance.type = type;
  }

  deleteProject() {
    const dialogRef = this.mdDialog.open(DeleteProjectComponent);
    dialogRef.componentInstance.project = this.project;
  }
}
