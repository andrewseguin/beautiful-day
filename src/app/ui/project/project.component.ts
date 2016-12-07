import {
  Component, OnInit, ViewEncapsulation, animate, style, transition,
  state, trigger, ViewChild
} from '@angular/core';
import {
  FirebaseListObservable, FirebaseAuth, FirebaseAuthState
} from "angularfire2";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Project} from "../../model/project";
import {ProjectsService} from "../../service/projects.service";
import {RequestsService} from "../../service/requests.service";
import {MediaQueryService} from "../../service/media-query.service";
import {SubheaderService} from "../../service/subheader.service";
import {MdSidenav} from "@angular/material";

@Component({
  selector: 'project',
  templateUrl: 'project.component.html',
  styleUrls: ['project.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('subheader', [
      state('visible', style({transform: 'translate3d(0, 0, 0)'})),
      state('hidden', style({transform: 'translate3d(0, -100%, 0)'})),
      transition('visible <=> hidden', [
        animate('350ms cubic-bezier(0.35, 0, 0.25, 1)')]
      ),
    ])
  ]
})
export class ProjectComponent implements OnInit {
  project: Project;
  requests: FirebaseListObservable<any[]>;
  user: FirebaseAuthState;
  subheaderVisibility: 'visible'|'hidden' = 'visible';

  userHasNoProject: boolean = false;

  @ViewChild('sidenav') sidenav: MdSidenav;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private auth: FirebaseAuth,
              private subheaderService: SubheaderService,
              private mediaQuery: MediaQueryService,
              private projectsService: ProjectsService,
              private requestsService: RequestsService) {}

  ngOnInit() {
    this.auth.subscribe(auth => this.user = auth );

    this.route.params.forEach((params: Params) => {
      if (!params['id']) {
        // If the user was directed here without a project, then go to first project
        this.projectsService.getProjects().take(1).subscribe(project => {
          this.router.navigate([`project/${project[0].$key}`]);
        });
      } else {
        this.projectsService.getProject(params['id']).subscribe(project => {
          this.project = project;
        });
        this.requests = this.requestsService.getProjectRequests(params['id']);
      }
    });

    this.subheaderService.visibilitySubject.subscribe(visibility => {
      this.subheaderVisibility = visibility ? 'visible' : 'hidden';
    });
  }

  isMobile(): boolean {
    return this.mediaQuery.isMobile();
  }

  trigger(): void {
    if (this.subheaderVisibility == 'visible') {
      this.subheaderVisibility = 'hidden';
    } else {
      this.subheaderVisibility = 'visible';
    }
  }

  createNewProject(): void {
    this.projectsService.getProjects().push({name: 'test'});
  }

  logout(): void {
    this.auth.logout();
  }
}
