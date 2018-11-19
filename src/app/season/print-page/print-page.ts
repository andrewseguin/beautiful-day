import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {
  RequestRendererOptions,
} from 'app/season/services/requests-renderer/request-renderer-options';
import {RequestsRenderer} from 'app/season/services/requests-renderer/requests-renderer';
import {Item, ItemsDao, Project, ProjectsDao} from 'app/season/dao';
import {getItemName} from 'app/season/utility/item-name';
import {getRequestCost} from 'app/season/utility/request-cost';
import {Header} from 'app/season/services';

interface PrintPageParams {
  options: string; // JSON of RequestRendererOptionsState
  title: string;
}

@Component({
  selector: 'print-page',
  styleUrls: ['print-page.scss'],
  templateUrl: 'print-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RequestsRenderer]
})
export class PrintPage {
  getItemName = getItemName;
  getRequestCost = getRequestCost;

  displayedColumns = [
    'quantity',
    'request-cost',
    'item',
    'details',
    'status',
  ];

  itemsMap: Map<string, Item>;
  projectsMap: Map<string, Project>;

  constructor(private activatedRoute: ActivatedRoute,
              private header: Header,
              private itemsDao: ItemsDao,
              private projectsDao: ProjectsDao,
              public requestsRenderer: RequestsRenderer) {
    const params = this.activatedRoute.snapshot.params as PrintPageParams;
    this.header.title.next(params.title);

    this.itemsDao.map.subscribe(map => this.itemsMap = map);
    this.projectsDao.map.subscribe(map => this.projectsMap = map);

    const options = new RequestRendererOptions();
    options.setState(JSON.parse(params.options));

    this.requestsRenderer.options = options;
    this.requestsRenderer.initialize();
  }
}
