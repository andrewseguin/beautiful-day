import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Request} from 'app/model/request';
import {Report} from 'app/model/report';
import {Project} from 'app/model/project';
import {Item} from 'app/model/item';
import {Title} from '@angular/platform-browser';
import {take} from 'rxjs/operators';
import {ItemsDao, ProjectsDao, ReportsDao, RequestsDao} from 'app/ui/season/dao';

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
  season: string;

  constructor(private activatedRoute: ActivatedRoute,
              private titleService: Title,
              private requestsDao: RequestsDao,
              private itemsDao: ItemsDao,
              private projectsDao: ProjectsDao,
              private reportsDao: ReportsDao) { }

  ngOnInit() {
    this.type = this.activatedRoute.snapshot.params.type;
    const id = this.activatedRoute.snapshot.params.id;
    if (this.type === 'report') {
      this.reportsDao.get(id).subscribe((report: Report) => {
        this.season = report.season;
        this.titleService.setTitle(report.name);
        this.performQuery();
      });
    } else if (this.type === 'project') {
      this.projectsDao.get(id).subscribe((project: Project) => {
        this.titleService.setTitle(project.name);
        this.season = project.season;
        this.performQuery();
      });
    }

    this.requestsDao.list.subscribe(requests => {
      this.requests = requests; this.performQuery();
    });

    this.itemsDao.list.subscribe(items => {
      this.items = items; this.performQuery();
    });

    this.projectsDao.list.pipe(take(1)).subscribe(projects => {
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
