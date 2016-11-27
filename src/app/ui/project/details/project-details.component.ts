import { Component, OnInit } from '@angular/core';
import {Params, ActivatedRoute} from "@angular/router";
import {RequestsService} from "../../../service/requests.service";
import {ProjectsService} from "../../../service/projects.service";
import {Request} from "../../../model/request";
import {FirebaseListObservable, FirebaseObjectObservable} from "angularfire2";
import {Project} from "../../../model/project";

@Component({
  selector: 'project-details',
  templateUrl: 'project-details.component.html',
  styleUrls: ['project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit {
  project: FirebaseObjectObservable<Project>;
  requests: FirebaseListObservable<Request[]>;

  constructor(private route: ActivatedRoute,
              private projectsService: ProjectsService,
              private requestsService: RequestsService,) { }

  ngOnInit() {
    this.route.parent.params.forEach((params: Params) => {
      this.project = this.projectsService.getProject(params['id']);
      this.requests = this.requestsService.getProjectRequests(params['id']);
    });
  }
}
