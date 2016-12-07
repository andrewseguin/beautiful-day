import { Component, OnInit } from '@angular/core';
import {Params, ActivatedRoute} from "@angular/router";
import {ProjectsService} from "../../../service/projects.service";
import {Request} from "../../../model/request";
import {FirebaseListObservable, FirebaseObjectObservable} from "angularfire2";
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
  project: FirebaseObjectObservable<Project>;
  requests: FirebaseListObservable<Request[]>;

  constructor(private route: ActivatedRoute,
              private mdDialog: MdDialog,
              private projectsService: ProjectsService) { }

  ngOnInit() {
    this.route.parent.params.forEach((params: Params) => {
      this.project = this.projectsService.getProject(params['id'])
    });
  }

  edit(type: EditType) {
    const dialogRef = this.mdDialog.open(EditProjectComponent);
    this.project.take(1).subscribe(project => {
      dialogRef.componentInstance.project = project;
    });
    dialogRef.componentInstance.type = type;
  }

  deleteProject() {
    const dialogRef = this.mdDialog.open(DeleteProjectComponent);
    dialogRef.componentInstance.project = this.project;
  }
}
