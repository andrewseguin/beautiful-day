import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {ActivatedRoute} from '@angular/router';
import {Item, Project, ProjectsDao, RequestsDao} from 'app/season/dao';
import {createRequest} from 'app/season/utility/create-request';
import {EXPANSION_ANIMATION} from 'app/utility/animations';
import {highlight} from 'app/utility/element-actions';
import {combineLatest} from 'rxjs';
import {take} from 'rxjs/operators';
import {User} from 'firebase';

@Component({
  selector: 'inventory-panel-item',
  templateUrl: 'inventory-panel-item.html',
  styleUrls: ['inventory-panel-item.scss'],
  host: {
    '[class.mat-elevation-z1]': '!expanded',
    '[class.mat-elevation-z10]': 'expanded',
    '[class.expanded]': 'expanded',
    '[class.theme-background-card]': 'true'
  },
  animations: EXPANSION_ANIMATION,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InventoryPanelItem {
  expanded = false;
  requestQuantity = 1;
  requested: boolean;
  hasExpanded: boolean;

  @Input() item: Item;

  @Input() showCategory: boolean;

  constructor(private activatedRoute: ActivatedRoute,
              private cd: ChangeDetectorRef,
              private projectsDao: ProjectsDao,
              private afAuth: AngularFireAuth,
              private requestsDao: RequestsDao) { }

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

    const projectId = this.activatedRoute.snapshot.params.id;
    combineLatest([this.projectsDao.get(projectId), this.afAuth.authState])
        .pipe(take(1))
        .subscribe(result => {
          const project = result[0] as Project;
          const user = result[1] as User;

          const request = createRequest(project, this.item.id, this.requestQuantity, user.email);
          this.requestsDao.add(request).then(id => {
            highlight(id);
          });
        });

    window.setTimeout(() => {
      this.requested = false;
      this.requestQuantity = 1;
      this.cd.markForCheck();
    }, 1500);
  }
}
