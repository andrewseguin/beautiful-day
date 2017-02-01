import { Component, OnInit } from '@angular/core';
import {HeaderService} from '../../../service/header.service';
import {ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  reportId: string;

  constructor(private route: ActivatedRoute,
              private headerService: HeaderService) { }

  ngOnInit() {
    this.headerService.title = 'Reports';
    this.route.params.subscribe((params: Params) => {
      this.reportId = params['id'];
      console.log(this.reportId);
    });
  }
}
