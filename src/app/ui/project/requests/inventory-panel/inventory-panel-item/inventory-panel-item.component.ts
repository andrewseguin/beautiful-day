import {
  Component, OnInit, Input, EventEmitter, Output, animate, transition,
  style, state, trigger, ChangeDetectionStrategy, AnimationTransitionEvent, keyframes
} from '@angular/core';
import {Item} from '../../../../../model/item';
import {Route, Params, ActivatedRoute} from "@angular/router";
import {Project} from "../../../../../model/project";
import {FirebaseObjectObservable} from "angularfire2";
import {RequestsService} from "../../../../../service/requests.service";
import {ProjectsService} from "../../../../../service/projects.service";

export type InventoryPanelItemState = 'collapsed' | 'expanded';

export interface CreateRequestEvent {
  item: Item;
  quantity: number;
}

@Component({
  selector: 'inventory-panel-item',
  templateUrl: './inventory-panel-item.component.html',
  styleUrls: ['./inventory-panel-item.component.scss'],
  host: {
    '[class.md-elevation-z1]': "state == 'collapsed'",
    '[class.md-elevation-z10]': "state == 'expanded'",
    '[@size]': 'state',
    '(@size.done)': 'sizeAnimationDone($event)',
  },
  animations: [
    trigger('size', [
      state('collapsed', style({height: '48px', margin: '0 8px'})),
      state('expanded', style({height: '*', margin: '16px 8px'})),
      transition('collapsed <=> expanded', [
        animate('250ms cubic-bezier(0.35, 0, 0.25, 1)')
      ]),
    ]),
    trigger('arrow', [
      state('collapsed', style({transform: 'rotateX(0deg)'})),
      state('expanded', style({transform: 'rotateX(180deg)'})),
      transition('collapsed <=> expanded', [
        animate('250ms cubic-bezier(0.35, 0, 0.25, 1)')
      ]),
    ]),
  ]
})
export class InventoryPanelItemComponent {
  state: InventoryPanelItemState = 'collapsed';
  requestQuantity: number = 1;
  requested: boolean;
  project: FirebaseObjectObservable<Project>;

  @Input() item: Item;

  constructor(private route: ActivatedRoute,
              private projectsService: ProjectsService,
              private requestsService: RequestsService) { }

  ngOnInit() {
    this.route.parent.params.subscribe((params: Params) => {
      this.project = this.projectsService.getProject(params['id']);
    });
  }

  getItemName() {
    let name = this.item.name;
    if (this.item.type) {
      name += ` - ${this.item.type}`;
    }

    return name;
  }

  toggleState() {
    this.state = this.state == 'collapsed' ? 'expanded' : 'collapsed';
  }

  request() {
    this.requested = true;
    this.project.first().subscribe(project => {
      this.requestsService.addRequest(project, this.item, this.requestQuantity)
    });
  }

  sizeAnimationDone(e: AnimationTransitionEvent) {
    if (e.toState == 'collapsed') {
      this.requested = false;
      this.requestQuantity = 1;
    }
  }

}
