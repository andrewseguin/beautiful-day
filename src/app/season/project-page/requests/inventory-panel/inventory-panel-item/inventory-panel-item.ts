import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {take} from 'rxjs/operators';
import {Item, Project, ProjectsDao, Request, RequestsDao} from 'app/season/dao';
import {EXPANSION_ANIMATION} from 'app/utility/animations';

@Component({
  selector: 'inventory-panel-item',
  templateUrl: 'inventory-panel-item.html',
  styleUrls: ['inventory-panel-item.scss'],
  host: {
    '[class.mat-elevation-z1]': '!expanded',
    '[class.mat-elevation-z10]': 'expanded',
    '[class.expanded]': 'expanded',
  },
  animations: EXPANSION_ANIMATION,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InventoryPanelItem implements OnInit {
  expanded = false;
  requestQuantity = 1;
  requested: boolean;
  project: Observable<Project>;

  @Input() item: Item;

  @Input() showCategory: boolean;

  constructor(private activatedRoute: ActivatedRoute,
              private cd: ChangeDetectorRef,
              private projectsDao: ProjectsDao,
              private requestsDao: RequestsDao) { }

  ngOnInit() {
    const projectId = this.activatedRoute.snapshot.params.id;
    this.project = this.projectsDao.get(projectId);
  }

  getItemName() {
    let name = this.item.name;

    if (this.showCategory) {
      name = this.item.categories[0].replace('>', ' > ') + ' > ' + name;
    }

    return name;
  }

  request() {
    this.requestQuantity = Math.max(0, this.requestQuantity);
    this.requested = true;
    this.project.pipe(take(1)).subscribe(project => {
      const defaultDate = new Date(); // TODO: Make this config value

      const date = project.lastUsedDate ? new Date(project.lastUsedDate) : defaultDate;
      const request: Request = {
        item: this.item.id,
        project: project.id,
        quantity: this.requestQuantity,
        dropoff: 'Westgate Gym',
        date: date.toISOString(),
        dateAdded: new Date().toISOString()
      };

      this.requestsDao.add(request);
    });

    window.setTimeout(() => {
      this.requested = false;
      this.requestQuantity = 1;
      this.cd.markForCheck();
    }, 1500);
  }
}
