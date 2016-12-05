import { Component, OnInit } from '@angular/core';
import {Params, ActivatedRoute} from "@angular/router";
import {RequestsService} from "../../../service/requests.service";
import {ProjectsService} from "../../../service/projects.service";
import {Request} from "../../../model/request";
import {FirebaseListObservable, FirebaseObjectObservable} from "angularfire2";
import {Project} from "../../../model/project";
import {MdDialog} from "@angular/material";
import {EditProjectComponent} from "../../dialog/edit-project/edit-project.component";

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

  edit() {
    const dialogRef = this.mdDialog.open(EditProjectComponent);
    console.log(this.project);
    dialogRef.componentInstance.project = this.project;
  }
}
