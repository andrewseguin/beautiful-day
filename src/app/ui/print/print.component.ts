import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Params} from "@angular/router";
import {Request} from "../../model/request";
import {ReportsService} from "../../service/reports.service";
import {ReportQueryService} from "../../service/report-query.service";
import {ProjectsService} from "../../service/projects.service";
import {ItemsService} from "../../service/items.service";
import {RequestsService} from "../../service/requests.service";
import {Report} from "../../model/report";
import {Project} from "../../model/project";
import {Item} from "../../model/item";

@Component({
  selector: 'print',
  templateUrl: 'print.component.html',
  styleUrls: ['print.component.scss']
})
export class PrintComponent implements OnInit {
  report: Report;
  items: Item[];
  projects: Project[];
  requests: Request[];
  reportId: string;
  reportRequests: Request[] = [];

  constructor(private route: ActivatedRoute,
              private requestsService: RequestsService,
              private itemsService: ItemsService,
              private projectsService: ProjectsService,
              private reportQueryService: ReportQueryService,
              private reportsService: ReportsService) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.reportId = params['reportId'];

      this.reportsService.get(this.reportId).subscribe(report => {
        this.report = report; this.performQuery();
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
    });

  }

  performQuery() {
    if (!this.items || !this.projects || !this.report || !this.requests) { return; }

    this.reportRequests = this.reportQueryService.query(
      this.report.queryStages, this.requests, this.items, this.projects);
  }

}
