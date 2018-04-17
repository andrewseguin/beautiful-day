import {Component, OnInit} from '@angular/core';
import {TitleService} from 'app/service/header.service';
import {ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.scss']
})
export class ReportingComponent implements OnInit {
  reportId: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.reportId = params['id'];
    });
  }
}
