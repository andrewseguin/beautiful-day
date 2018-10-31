import {Component, Input, OnInit} from '@angular/core';
import {animate, animateChild, query, state, style, transition, trigger} from '@angular/animations';
import {Item} from 'app/model/item';
import {ActivatedRoute} from '@angular/router';
import {Project} from 'app/model/project';
import {ProjectsDao, RequestsDao} from 'app/ui/season/dao';
import {Observable} from 'rxjs/Observable';
import {take} from 'rxjs/operators';
import {Request} from 'app/model/request';

export type InventoryPanelItemState = 'collapsed' | 'expanded';

const ANIMATION_DURATION = '250ms cubic-bezier(0.35, 0, 0.25, 1)';

@Component({
  selector: 'inventory-panel-item',
  templateUrl: './inventory-panel-item.component.html',
  styleUrls: ['./inventory-panel-item.component.scss'],
  host: {
    '[class.mat-elevation-z1]': `state == 'collapsed'`,
    '[class.mat-elevation-z10]': `state == 'expanded'`,
    '[@container]': 'state',
    '[@animateChildren]': 'state',
  },
  animations: [
    trigger('container', [
      state('void, collapsed', style({margin: '0 8px'})),
      state('expanded', style({margin: '16px 8px'})),
      transition('* <=> *', animate(ANIMATION_DURATION)),
    ]),
    trigger('info', [
      state('void, collapsed', style({height: '0px'})),
      state('expanded', style({height: '*'})),
      transition('* <=> *', animate(ANIMATION_DURATION)),
    ]),
    trigger('arrow', [
      state('void, collapsed', style({transform: 'rotateX(0deg)'})),
      state('expanded', style({transform: 'rotateX(180deg)'})),
      transition('* <=> *', animate(ANIMATION_DURATION)),
    ]),
    trigger('animateChildren', [
      transition('* <=> *', [
        query('@*', animateChild(), {optional: true})
      ])
    ])
  ]
})
export class InventoryPanelItemComponent implements OnInit {
  state: InventoryPanelItemState = 'collapsed';
  requestQuantity = 1;
  requested: boolean;
  project: Observable<Project>;

  @Input() item: Item;

  @Input() showCategory: boolean;

  constructor(private activatedRoute: ActivatedRoute,
              private projectsDao: ProjectsDao,
              private requestsDao: RequestsDao) { }

  ngOnInit() {
    const projectId = this.activatedRoute.snapshot.params.id;
    this.project = this.projectsDao.get(projectId);
  }

  getItemName() {
    let name = this.item.name;

    if (this.showCategory) {
      name = this.item.categories.split(',')[0] + ' > ' + name;
    }

    return name;
  }

  toggleState() {
    this.state = this.state === 'collapsed' ? 'expanded' : 'collapsed';
  }

  request() {
    this.requestQuantity = Math.max(0, this.requestQuantity);
    this.requested = true;
    this.project.pipe(take(1)).subscribe(project => {
      const defaultDate = new Date(); // TODO: Make this config value
      const date = project.lastUsedDate ? new Date(Number(project.lastUsedDate)) : defaultDate;
      const request: Request = {
        item: this.item.id,
        project: project.id,
        quantity: this.requestQuantity,
        dropoff: 'Westgate Gym',
        date: date.toISOString()
      };

      this.requestsDao.add(request);
    });

    window.setTimeout(() => {
      this.requested = false;
      this.requestQuantity = 1;
    }, 1500);
  }
}
