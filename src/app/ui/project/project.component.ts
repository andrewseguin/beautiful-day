import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FirebaseObjectObservable, FirebaseListObservable} from "angularfire2";
import {ActivatedRoute, Params} from "@angular/router";
import {Project} from "../../model/project";
import {ProjectsService} from "../../service/projects.service";
import {RequestsService} from "../../service/requests.service";
import {ItemsService} from "../../service/items.service";

@Component({
  selector: 'project',
  templateUrl: 'project.component.html',
  styleUrls: ['project.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProjectComponent implements OnInit {
  project: FirebaseObjectObservable<Project>;
  requests: FirebaseListObservable<any[]>;

  constructor(private route: ActivatedRoute,
              private projectsService: ProjectsService,
              private requestsService: RequestsService,
              private itemsService: ItemsService) { }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      this.project = this.projectsService.getProject(params['id']);
      this.requests = this.requestsService.getProjectRequests(params['id']);
    });
  }

  createNewProject() {
    this.projectsService.getProjects().push({name: 'test'});
  }

  getItemName(itemKey: string) {
    return this.itemsService.getItem(itemKey);
  }
}
