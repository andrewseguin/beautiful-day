import { Component, OnInit } from '@angular/core';
import {Params, ActivatedRoute} from "@angular/router";
import {ProjectsService} from "../../../service/projects.service";
import {Request} from "../../../model/request";
import {
  FirebaseListObservable, FirebaseAuth,
  FirebaseAuthState
} from "angularfire2";
import {Project} from "../../../model/project";
import {MdDialog} from "@angular/material";
import {EditProjectComponent, EditType} from "../../shared/dialog/edit-project/edit-project.component";
import {DeleteProjectComponent} from "../../shared/dialog/delete-project/delete-project.component";

@Component({
  selector: 'project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit {
  project: Project;
  requests: FirebaseListObservable<Request[]>;
  user: FirebaseAuthState;
  managers: string[];
  director: string;
  acquisitions: string;

  constructor(private route: ActivatedRoute,
              private mdDialog: MdDialog,
              private auth: FirebaseAuth,
              private projectsService: ProjectsService) { }

  ngOnInit() {
    this.auth.subscribe(auth => this.user = auth);

    this.route.parent.params.forEach((params: Params) => {
      this.projectsService.getProject(params['id']).subscribe((project: Project) => {
        this.project = project;
      });
    });
  }

  edit(type: EditType) {
    const dialogRef = this.mdDialog.open(EditProjectComponent);
    dialogRef.componentInstance.project = this.project;
    dialogRef.componentInstance.type = type;
  }

  canEdit(): boolean {
    if (!this.user || !this.project) return false;

    // Return true if the user is a director
    return this.project.director != this.user.auth.email;
  }

  getManagerEmails(): string[] {
    return this.project.managers ? this.project.managers.split(',') : [];
  }

  deleteProject() {
    const dialogRef = this.mdDialog.open(DeleteProjectComponent);
    dialogRef.componentInstance.project = this.project;
  }
}
