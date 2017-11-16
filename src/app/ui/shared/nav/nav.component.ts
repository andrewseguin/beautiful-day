import {Component, Input, OnInit} from '@angular/core';
import {MatSidenav} from '@angular/material';
import {Router} from '@angular/router';
import {PermissionsService} from '../../../service/permissions.service';
import {Project} from '../../../model/project';
import {ProjectsService} from '../../../service/projects.service';
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

  seasons = ['2017', '2016'];
  expandedSeasons = new Set<string>();

  constructor(private projectsService: ProjectsService,
              private permissionsService: PermissionsService,
              private router: Router) { }

  @Input() sidenav: MatSidenav;

  ngOnInit() {
    this.projectsService.getSortedProjects()
        .subscribe(projects => this.projects = projects);

    this.permissionsService.canCreateProjects()
        .subscribe(canCreateProjects => this.canCreateProjects = canCreateProjects);

    this.permissionsService.canViewFeedback()
        .subscribe(canViewFeedback => this.canViewFeedback = canViewFeedback);

    this.permissionsService.canManageAcqusitions()
        .subscribe(canManageAcqusitions => this.canManageAcqusitions = canManageAcqusitions);
  }

  addProject() {
    this.projectsService.createProject().then(response => {
      this.router.navigate([`project/${response.getKey()}`]);
      this.sidenav.close();
    });
  }

  nagivateToHome() {
    this.router.navigate(['/home']);
    this.sidenav.close();
  }

  getExpansionState(season: string) {
    return this.expandedSeasons.has(season) ? 'expanded' : 'collapsed';
  }

  toggleExpansion(season: string) {
    this.expandedSeasons.has(season) ?
      this.expandedSeasons.delete(season) :
      this.expandedSeasons.add(season);
  }

  getProjects(season: string) {
    return this.projects;
  }
}
