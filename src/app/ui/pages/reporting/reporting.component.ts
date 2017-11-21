import {Component, OnInit} from '@angular/core';
import {HeaderService} from '../../../service/header.service';
import {ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.scss']
})
export class ReportingComponent implements OnInit {
  reportId: string;

  constructor(private route: ActivatedRoute,
              private headerService: HeaderService) { }

  ngOnInit() {
    this.headerService.title = 'Reporting';
    this.route.params.subscribe((params: Params) => {
      this.reportId = params['id'];
    });
  }
}
