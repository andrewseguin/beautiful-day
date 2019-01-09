import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input, Output
} from '@angular/core';
import {Request, Item} from 'app/season/dao';
import {ItemsDao} from 'app/season/dao';
import {takeUntil, take} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {Selection, Permissions} from 'app/season/services';


@Component({
  selector: 'requests-group',
  templateUrl: 'requests-group.html',
  styleUrls: ['requests-group.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestsGroup {
  items = new Map<string, Item>();

  canEdit: boolean;

  @Input() requests: Request[];

  @Input() title: string;

  getRequestKey = (_i, request: Request) => request.id;

  @Output() selectGroup = new EventEmitter();

  private destroyed = new Subject();

  constructor(private itemsDao: ItemsDao,
              public selection: Selection,
              private permissions: Permissions,
              private cd: ChangeDetectorRef) {
    this.itemsDao.map.pipe(takeUntil(this.destroyed)).subscribe(itemsMap => {
      this.items = itemsMap;
      this.cd.markForCheck();
    });
  }

  ngOnChanges() {
    if (this.requests) {
      this.permissions.editableProjects.pipe(
        take(1))
        .subscribe(editableProjects => {
          if (editableProjects) {
            this.canEdit = this.requests.every(r => editableProjects.has(r.project));
            this.cd.markForCheck();
          }
        });
    }
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  selectAll() {
    if (this.canEdit) {
      this.selectGroup.emit();
    }
  }
}
