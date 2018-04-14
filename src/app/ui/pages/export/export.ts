import {Component} from '@angular/core';
import {Request} from 'app/model/request';
import {RequestsService} from 'app/service/requests.service';
import {ItemsService} from 'app/service/items.service';
import {Item} from 'app/model/item';
import {MatTableDataSource} from '@angular/material';
import {ProjectsService} from 'app/service/projects.service';
import {Project} from 'app/model/project';
import {combineLatest} from 'rxjs/observable/combineLatest';

export interface ExportedRequest {
  item: string;
  project: string;
  season: string;
  requestCost: number;

  // Request
  quantity: number;
  note: string;
  date: number;
  tags: string;
  purchaser: string;
  isPurchased: boolean;
  isApproved: boolean;
  allocation: number;

  // Item
  categories: string;
  url: string;
  itemCost: number;
  isRental: boolean;
  addedBy: string;
  dateAdded: number;
  keywords: string;
  quantityOwned: string;
  hidden: boolean;

  // Project:
  location: string;
  budget: number;
  description: string;
  leads: string;
  directors: string;
  acquisitions: string;
  auth: string[];
  receiptsFolder: string;
}

export const COLUMNS = [
  'item',
  'project',
  // 'season',
  'requestCost',
  'itemCost',
  'quantity',

  // Request
  // 'date',
  'note',
  'tags',
  'purchaser',
  'isPurchased',
  'isApproved',


  // Item
  'allocation',
  'categories',
  'isRental',
  'addedBy',
  'keywords',
  // 'dateAdded',
  'quantityOwned',
  'url',
  'hidden',

  // Project:
  'location',
  'budget',
  'description',
  'leads',
  'directors',
  'acquisitions',
  // 'auth',
  'receiptsFolder',
];

@Component({
  templateUrl: 'export.html',
  styleUrls: ['export.scss'],
})
export class ExportPage {
  requests: ExportedRequest[] = [];
  columns = COLUMNS;
  displayedColumns = COLUMNS;
  showTable = false;

  items = new Map<string, Item>();
  projects = new Map<string, Project>();
  dataSource = new MatTableDataSource();

  constructor(requestsService: RequestsService,
              itemsService: ItemsService,
              projectsService: ProjectsService) {
    const streams = [
      requestsService.requests,
      itemsService.items,
      projectsService.projects,
    ];
    combineLatest(...streams).subscribe(([requests, items, projects]) => {
      items.forEach(v => this.items.set(v.$key, v));

      // Huh. Complains thinking that projects is a list of requests.
      (projects as any as Project[]).forEach((v: Project) => this.projects.set(v.$key, v));

      requests.forEach((r: Request) => {
        const i = this.items.get(r.item);
        const p = this.projects.get(r.project);

        if (p.season === '2017') { return; }

        // Consider making more columns for categories

        this.requests.push({
          item: i.name,
          project: p.name,
          season: p.season,
          requestCost: r.quantity * i.cost,

          // Request
          quantity: r.quantity,
          note: r.note,
          date: r.date,
          tags: r.tags,
          purchaser: r.purchaser,
          isPurchased: r.isPurchased,
          isApproved: r.isApproved,
          allocation: r.allocation,

          // Item
          categories: i.categories,
          url: i.url,
          itemCost: i.cost,
          isRental: i.isRental,
          addedBy: i.addedBy,
          dateAdded: i.dateAdded,
          keywords: i.keywords,
          quantityOwned: i.quantityOwned,
          hidden: i.hidden,

          // Project
          location: p.location,
          budget: p.budget,
          description: p.description,
          leads: p.leads,
          directors: p.directors,
          acquisitions: p.acquisitions,
          auth: p.auth,
          receiptsFolder: p.receiptsFolder,
        });
      });

      this.dataSource.data = this.requests;
      setTimeout(() => { this.showTable = true; }, 10);
    });
  }
}
