import {
  Component, OnInit, animate, transition, style, state, trigger, Input
} from '@angular/core';
import {HeaderService} from "../../../service/header.service";
import {FirebaseAuth, FirebaseAuthState} from "angularfire2";
import {MediaQueryService} from "../../../service/media-query.service";
import {SubheaderService} from "../../../service/subheader.service";
import {ActivatedRoute, UrlSegment, Router, Event} from "@angular/router";
import {TopLevelSection} from "../../../router.config";
import {ProjectsService} from "../../../service/projects.service";
import {Project} from "../../../model/project";
import {MdSidenav} from "@angular/material";

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    trigger('subheader', [
      state('visible', style({transform: 'translate3d(0, 0, 0)'})),
      state('hidden', style({transform: 'translate3d(0, -100%, 0)'})),
      transition('visible <=> hidden', [
        animate('350ms cubic-bezier(0.35, 0, 0.25, 1)')]
      ),
    ])
  ],
  host: {
    '[style.display]': "user ? 'block' : 'none'"
  }
})
export class HeaderComponent implements OnInit {
  topLevel: TopLevelSection;
  user: FirebaseAuthState;
  project: Project;
  subheaderVisibility: 'visible'|'hidden' = 'visible';

  @Input() sidenav: MdSidenav;

  constructor(
    private auth: FirebaseAuth,
    private route: ActivatedRoute,
    private router: Router,
    private projectsService: ProjectsService,
    private mediaQuery: MediaQueryService,
    private subheaderService: SubheaderService,
    private headerService: HeaderService) { }

  ngOnInit() {
    this.auth.subscribe(auth => this.user = auth );

    this.subheaderService.visibilitySubject.subscribe(visibility => {
      this.subheaderVisibility = visibility ? 'visible' : 'hidden';
    });

    this.router.events.subscribe((event: Event) => {
      if (this.route.firstChild) {
        this.handleRouteChange(this.route.firstChild);
      }
    });
  }

  handleRouteChange(route: ActivatedRoute) {
    route.url.take(1).subscribe((url: UrlSegment[]) => {
      this.topLevel = <TopLevelSection>url[0].path;

      this.project = null;
      if (this.topLevel == 'project') {
        this.headerService.title = 'Loading...';
        this.projectsService.getProject(url[1].path).subscribe(project => {
          this.project = project;
          if (project.$exists()) {
            this.headerService.title = project.name;
          } else {
            this.headerService.title = '';
          }
        });
      }
    });
  }

  getTitle(): string {
    return this.headerService.title;
  }

  isMobile(): boolean {
    return this.mediaQuery.isMobile();
  }

  logout(): void {
    this.auth.logout();
  }
}
