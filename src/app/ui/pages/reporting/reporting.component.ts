import { Component, OnInit } from '@angular/core';
import {HeaderService} from '../../../service/header.service';
import {ActivatedRoute, Params} from '@angular/router';
import {MediaQueryService} from "../../../service/media-query.service";

@Component({
  selector: 'reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.scss']
})
export class ReportingComponent implements OnInit {
  reportId: string;

  constructor(private route: ActivatedRoute,
              private mediaQuery: MediaQueryService,
              private headerService: HeaderService) { }

  ngOnInit() {
    this.headerService.title = 'Reporting';
    this.route.params.subscribe((params: Params) => {
      this.reportId = params['id'];
    });
  }

  hideQueries(): boolean {
    return this.mediaQuery.isMobile();
  }
}
