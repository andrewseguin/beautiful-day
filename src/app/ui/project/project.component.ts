import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {
  FirebaseObjectObservable, FirebaseListObservable, AngularFire,
  FirebaseAuth, FirebaseAuthState
} from "angularfire2";
import {ActivatedRoute, Params, Router} from "@angular/router";
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
  user: FirebaseAuthState;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private auth: FirebaseAuth,
              private projectsService: ProjectsService,
              private requestsService: RequestsService,
              private itemsService: ItemsService) {}

  ngOnInit() {
    this.auth.subscribe(auth => this.user = auth );

    this.route.params.forEach((params: Params) => {
      if (!params['id']) {
        const authSub = this.auth.subscribe(auth => {
          // TODO: Use user to determine their project and go there
          this.router.navigate(['project/-KPUWxkWYm6E0HiMArw8']);
        })
      } else {
        this.project = this.projectsService.getProject(params['id']);
        this.requests = this.requestsService.getProjectRequests(params['id']);
      }
    });
  }

  createNewProject() {
    this.projectsService.getProjects().push({name: 'test'});
  }

  getItemName(itemKey: string) {
    return this.itemsService.getItem(itemKey);
  }

  login() {
    this.auth.login();
  }

  logout() {
    this.auth.logout();

    console.log('go to login')
    this.router.navigate(['login']);
  }
}
