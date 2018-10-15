import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {Request} from 'app/model/request';
import {ReportsService} from 'app/service/reports.service';
import {ProjectsService} from 'app/service/projects.service';
import {ItemsService} from 'app/service/items.service';
import {RequestsService} from 'app/service/requests.service';
import {Report} from 'app/model/report';
import {Project} from 'app/model/project';
import {Item} from 'app/model/item';
import {Title} from '@angular/platform-browser';
import {take} from 'rxjs/operators';

@Component({
  selector: 'print',
  templateUrl: 'print.component.html',
  styleUrls: ['print.component.scss']
})
export class PrintComponent implements OnInit {
  type: 'report'|'project';
  report: Report;
  items: Item[];
  projects: Project[];
  requests: Request[];
  reportRequests: Request[] = [];
  season: string;

  constructor(private route: ActivatedRoute,
              private titleService: Title,
              private requestsService: RequestsService,
              private itemsService: ItemsService,
              private projectsService: ProjectsService,
              private reportsService: ReportsService) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.type = params['type'];
      if (this.type === 'report') {
        this.reportsService.get(params['id']).subscribe((report: Report) => {
          this.season = report.season;
          this.titleService.setTitle(report.name);
          this.performQuery();
        });
      } else if (this.type === 'project') {
        this.projectsService.get(params['id']).subscribe((project: Project) => {
          this.titleService.setTitle(project.name);
          this.season = project.season;
          this.performQuery();
        });
      }
    });

    this.requestsService.requests.subscribe(requests => {
      this.requests = requests; this.performQuery();
    });

    this.itemsService.items.subscribe(items => {
      this.items = items; this.performQuery();
    });

    this.projectsService.projects.pipe(take(1)).subscribe(projects => {
      this.projects = projects; this.performQuery();
    });
  }

  canPerformQuery() {
    return this.items && this.projects && this.requests;
  }

  performQuery() {
    if (!this.canPerformQuery()) { return; }

    setTimeout(() => {
      window.print();
    }, 3000);
  }

}
