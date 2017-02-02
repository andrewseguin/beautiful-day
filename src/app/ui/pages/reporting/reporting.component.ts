import { Component, OnInit } from '@angular/core';
import {HeaderService} from '../../../service/header.service';
import {ActivatedRoute, Params} from '@angular/router';
import {MediaQueryService} from "../../../service/media-query.service";
import {Request} from "../../../model/request";
import {RequestsService} from "../../../service/requests.service";

@Component({
  selector: 'reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.scss']
})
export class ReportingComponent implements OnInit {
  reportId: string;
  requests: Request[] = [];

  constructor(private route: ActivatedRoute,
              private mediaQuery: MediaQueryService,
              private requestsService: RequestsService,
              private headerService: HeaderService) { }

  ngOnInit() {
    this.headerService.title = 'Reporting';
    this.route.params.subscribe((params: Params) => {
      this.reportId = params['id'];
    });

    this.requestsService.getAllRequests()
        .subscribe(requests => this.requests = requests);
  }

  hideQueries(): boolean {
    return this.mediaQuery.isMobile();
  }
}
