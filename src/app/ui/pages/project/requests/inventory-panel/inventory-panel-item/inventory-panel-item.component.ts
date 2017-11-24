import {
  Component,
  Input,
  AnimationTransitionEvent, OnInit
} from '@angular/core';
import {
  animate,
  transition,
  style,
  state,
  trigger} from '@angular/animations';
import {Item} from '../../../../../../model/item';
import {Params, ActivatedRoute} from '@angular/router';
import {Project} from '../../../../../../model/project';
import {RequestsService} from '../../../../../../service/requests.service';
import {ProjectsService} from '../../../../../../service/projects.service';
import {Observable} from 'rxjs/Observable';
import {transformSnapshotAction} from '../../../../../../utility/snapshot-tranform';

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
  },
  animations: [
    trigger('container', [
      state('void, collapsed', style({margin: '0 8px'})),
      state('expanded', style({margin: '16px 8px'})),
      transition('collapsed <=> expanded', animate(ANIMATION_DURATION)),
    ]),
    trigger('info', [
      state('void, collapsed', style({height: '0'})),
      state('expanded', style({height: '*'})),
      transition('collapsed <=> expanded', animate(ANIMATION_DURATION)),
    ]),
    trigger('arrow', [
      state('void, collapsed', style({transform: 'rotateX(0deg)'})),
      state('expanded', style({transform: 'rotateX(180deg)'})),
      transition('collapsed <=> expanded', animate(ANIMATION_DURATION)),
    ]),
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
    if (this.item.type) {
      name += ` - ${this.item.type}`;
    }

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
    this.project.first().subscribe(project => {
      this.requestsService.addRequest(project, this.item, this.requestQuantity);
    });

    window.setTimeout(() => {
      this.requested = false;
      this.requestQuantity = 1;
    }, 1500);
  }
}
