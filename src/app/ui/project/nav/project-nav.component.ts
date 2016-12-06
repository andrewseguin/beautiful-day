import {Component, OnInit} from '@angular/core';
import {ProjectsService} from "../../../service/projects.service";
import {ActivatedRoute, Params} from "@angular/router";

@Component({
  selector: 'project-nav',
  templateUrl: 'project-nav.component.html',
  styleUrls: ['project-nav.component.scss']
})
export class ProjectNavComponent implements OnInit {
  projectExists: boolean;

  constructor(private projectsService: ProjectsService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      this.projectsService.getProject(params['id']).subscribe(project => {
        this.projectExists = project.$exists();
      });
    });
  }
}
