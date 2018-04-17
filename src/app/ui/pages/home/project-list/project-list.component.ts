import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Project} from 'app/model/project';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {ProjectsService} from 'app/service/projects.service';

@Component({
  selector: 'project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectListComponent {
  projects: Observable<Project[]>;

  @Input() season: string;

  constructor(private router: Router, private projectsService: ProjectsService) { }

  ngOnInit() {
    this.projects = this.projectsService.getSortedProjects(this.season);
  }

  navigateToProject(id: string) {
    this.router.navigate([`project/${id}`]);
  }
}
