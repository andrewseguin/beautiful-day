import {Component, Input, OnInit} from '@angular/core';
import {MatSidenav} from '@angular/material';
import {Router} from '@angular/router';
import {PermissionsService} from 'app/service/permissions.service';
import {Project} from 'app/model/project';
import {ProjectsService, sortProjectsByName} from 'app/service/projects.service';
import {animate, transition, state, style, trigger} from '@angular/animations';

@Component({
  selector: 'nav-content',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  animations: [
    trigger('expandableSection', [
      state('expanded', style({ height: '*' })),
      state('collapsed',   style({ height: '40px' })),
      transition('* => *', animate('225ms ease-in-out')),
    ]),
    trigger('expansionIndicator', [
      state('collapsed',   style({ transform: 'rotate(180deg)' })),
      transition('* => *', animate('225ms ease-in-out')),
    ])
  ]
})
export class NavComponent implements OnInit {
  canCreateProjects: boolean;
  canViewFeedback: boolean;
  canManageAcqusitions: boolean;
  projects: Project[];

  constructor(private projectsService: ProjectsService,
              private permissionsService: PermissionsService,
              private router: Router) { }

  @Input() sidenav: MatSidenav;

  ngOnInit() {
    this.projectsService.getProjectsBySeason('2017')
        .subscribe(projects => this.projects = sortProjectsByName(projects));

    this.permissionsService.canCreateProjects()
        .subscribe(canCreateProjects => this.canCreateProjects = canCreateProjects);

    this.permissionsService.canViewFeedback()
        .subscribe(canViewFeedback => this.canViewFeedback = canViewFeedback);

    this.permissionsService.canManageAcquisitions()
        .subscribe(canManageAcqusitions => this.canManageAcqusitions = canManageAcqusitions);
  }

  addProject() {
    const newProject = {
      name: 'New Project',
      description: '',
      location: ''
    };

    this.projectsService.add(newProject).then(response => {
      this.router.navigate([`project/${response.getKey()}`]);
      this.sidenav.close();
    });
  }

  nagivateToHome() {
    this.router.navigate(['/home']);
    this.sidenav.close();
  }
}
