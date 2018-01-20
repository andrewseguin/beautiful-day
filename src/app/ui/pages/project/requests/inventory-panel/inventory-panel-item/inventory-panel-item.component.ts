import {Component, Input, OnInit} from '@angular/core';
import {animate, animateChild, query, state, style, transition, trigger} from '@angular/animations';
import {Item} from 'app/model/item';
import {ActivatedRoute, Params} from '@angular/router';
import {Project} from 'app/model/project';
import {RequestsService} from 'app/service/requests.service';
import {ProjectsService} from 'app/service/projects.service';
import {Observable} from 'rxjs/Observable';
import {first} from 'rxjs/operators';

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
      transition('collapsed <=> expanded', animate(ANIMATION_DURATION)),
    ]),
    trigger('info', [
      state('void, collapsed', style({height: '0px'})),
      state('expanded', style({height: '*'})),
      transition('collapsed <=> expanded', animate(ANIMATION_DURATION)),
    ]),
    trigger('arrow', [
      state('void, collapsed', style({transform: 'rotateX(0deg)'})),
      state('expanded', style({transform: 'rotateX(180deg)'})),
      transition('collapsed <=> expanded', animate(ANIMATION_DURATION)),
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

  constructor(private route: ActivatedRoute,
              private projectsService: ProjectsService,
              private requestsService: RequestsService) { }

  ngOnInit() {
    this.route.parent.params.subscribe((params: Params) => {
      this.project = this.projectsService.get(params['id']);
    });
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

  expand() {
    this.state = 'expanded';
  }

  request() {
    this.requestQuantity = Math.max(0, this.requestQuantity);
    this.requested = true;
    this.project.pipe(first()).subscribe(project => {
      this.requestsService.addRequest(project, this.item, this.requestQuantity);
    });

    window.setTimeout(() => {
      this.requested = false;
      this.requestQuantity = 1;
    }, 1500);
  }
}
