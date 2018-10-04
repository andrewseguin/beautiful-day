import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {Request} from 'app/model/request';
import {ReportsService} from 'app/service/reports.service';
import {ReportQueryService} from 'app/service/report-query.service';
import {ProjectsService} from 'app/service/projects.service';
import {ItemsService} from 'app/service/items.service';
import {RequestsService} from 'app/service/requests.service';
import {QueryStage, Report} from 'app/model/report';
import {Project} from 'app/model/project';
import {Item} from 'app/model/item';
import {Title} from '@angular/platform-browser';
import {QueryDisplay} from 'app/utility/query-display';
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
  queryStages: QueryStage[];
  reportRequests: Request[] = [];
  season: string;

  constructor(private route: ActivatedRoute,
              private titleService: Title,
              private requestsService: RequestsService,
              private itemsService: ItemsService,
              private projectsService: ProjectsService,
              private reportQueryService: ReportQueryService,
              private reportsService: ReportsService) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.type = params['type'];
      if (this.type === 'report') {
        this.reportsService.get(params['id']).subscribe((report: Report) => {
          this.queryStages = report.queryStages;
          this.season = report.season;
          this.titleService.setTitle(report.name);
          this.performQuery();
        });
      } else if (this.type === 'project') {
        this.projectsService.get(params['id']).subscribe((project: Project) => {
          const queryString = `[projectId]:${project.$key}`;
          this.queryStages = [{querySet: [{queryString, type: 'any'}]}];
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
    return this.items && this.queryStages && this.projects && this.requests;
  }

  getQueryStagesDisplay() {
    return QueryDisplay.get(this.queryStages);
  }

  performQuery() {
    if (!this.canPerformQuery()) { return; }

    this.reportRequests = this.reportQueryService.query(
      this.queryStages, this.requests, this.items, this.projects, this.season);

    setTimeout(() => {
      window.print();
    }, 3000);
  }

}
