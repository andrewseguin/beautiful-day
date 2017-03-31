import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Params} from "@angular/router";
import {Request} from "../../model/request";
import {ReportsService} from "../../service/reports.service";
import {ReportQueryService} from "../../service/report-query.service";
import {ProjectsService} from "../../service/projects.service";
import {ItemsService} from "../../service/items.service";
import {RequestsService} from "../../service/requests.service";
import {Report, QueryStage} from "../../model/report";
import {Project} from "../../model/project";
import {Item} from "../../model/item";
import {DisplayOptions} from '../../model/display-options';
import {Title} from '@angular/platform-browser';
import {QueryDisplay} from '../../utility/query-display';

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
  displayOptions: DisplayOptions = {
    filter: '',
    grouping: 'category',
    sorting: 'request added',
    reverseSort: false,
    viewing: {
      cost: true,
      dropoff: true,
      notes: true,
      tags: true,
    },
  };
  reportRequests: Request[] = [];

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
      if (this.type == 'report') {
        this.reportsService.get(params['id']).subscribe(report => {
          this.queryStages = report.queryStages;
          this.displayOptions = report.displayOptions;
          this.titleService.setTitle(report.name);
          this.performQuery();
        });
      } else if (this.type == 'project') {
        this.projectsService.getProject(params['id']).subscribe(project => {
          debugger;
          const queryString = `[projectId]:${project.$key}`;
          this.queryStages = [{querySet: [{queryString, type: 'any'}]}];
          this.titleService.setTitle(project.name);
          this.performQuery();
        })
      }
    });

    this.requestsService.getAllRequests().subscribe(requests => {
      this.requests = requests; this.performQuery();
    });

    this.itemsService.getItems().subscribe(items => {
      this.items = items; this.performQuery();
    });

    this.projectsService.getProjects().subscribe(projects => {
      this.projects = projects; this.performQuery();
    });
  }

  canPerformQuery() {
    return this.items && this.queryStages && this.displayOptions && this.projects && this.requests;
  }

  getQueryStagesDisplay() {
    return QueryDisplay.get(this.queryStages);
  }

  performQuery() {
    if (!this.canPerformQuery()) { return; }

    this.reportRequests = this.reportQueryService.query(
      this.queryStages, this.requests, this.items, this.projects);

    setTimeout(() => {
      window.print();
    }, 3000)
  }

}
