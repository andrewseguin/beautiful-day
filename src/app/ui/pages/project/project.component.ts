import {
  Component, OnInit
} from '@angular/core';
import {FirebaseListObservable, FirebaseAuthState} from "angularfire2";
import {ActivatedRoute, Params} from "@angular/router";
import {Project} from "../../../model/project";
import {ProjectsService} from "../../../service/projects.service";

@Component({
  selector: 'project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
})
export class ProjectComponent implements OnInit {
  project: Project;
  requests: FirebaseListObservable<any[]>;
  user: FirebaseAuthState;

  constructor(
    private route: ActivatedRoute,
    private projectsService: ProjectsService) {}

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      this.projectsService.getProject(params['id']).subscribe(project => {
        this.project = project;
      });
    });
  }
}