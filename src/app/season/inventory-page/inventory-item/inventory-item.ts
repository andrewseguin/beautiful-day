import {Component, Input} from '@angular/core';
import {EditItem} from 'app/season/shared/dialog/edit-item/edit-item';
import {MatDialog} from '@angular/material';
import {Item, Project, ProjectsDao, Request, RequestsDao} from 'app/season/dao';
import {Selection} from 'app/season/services';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'inventory-item',
  templateUrl: 'inventory-item.html',
  styleUrls: ['inventory-item.scss'],
  host: {
    '(click)': 'setSelected(!isSelected())'
  }
})
export class InventoryItem {
  @Input() item: Item;

  projectsMap: Map<string, Project>;
  requests: Request[];
  requestsGroupedByProject = new Map<string, Request[]>();
  requestedProjects: string[] = [];

  private destroyed = new Subject();

  constructor(private projectsDao: ProjectsDao,
              private requestsDao: RequestsDao,
              private selection: Selection,
              private mdDialog: MatDialog) { }

  ngOnInit() {
    this.projectsDao.map.pipe(takeUntil(this.destroyed))
        .subscribe(projectsMap => {
          this.projectsMap = projectsMap;
          this.updateRequestsDisplay();
        });

    this.requestsDao.list.pipe(takeUntil(this.destroyed))
        .subscribe(requests => {
          this.requests = requests.filter(r => r.item === this.item.id);
          this.updateRequestsDisplay();
        });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  updateRequestsDisplay() {
    if (!this.requests || !this.projectsMap) { return; }

    this.requestsGroupedByProject = new Map<string, Request[]>();
    this.requests.forEach(request => {
      const projectRequests = this.requestsGroupedByProject.get(request.project) || [];
      projectRequests.push(request);
      this.requestsGroupedByProject.set(request.project, projectRequests);
    });

    // Sort list of projects by season and then alphabetize
    this.requestedProjects = Array.from(this.requestsGroupedByProject.keys());
  }

  isSelected(): boolean {
    return this.selection.items.isSelected(this.item.id);
  }

  setSelected(checked: boolean) {
    const selection = this.selection.items;
    checked ? selection.select(this.item.id) : selection.deselect(this.item.id);
  }

  editItem() {
    const dialogRef = this.mdDialog.open(EditItem);
    dialogRef.componentInstance.mode = 'edit';
    dialogRef.componentInstance.item = this.item;
  }

  openItemUrl() {
    window.open(this.item.url);
  }
}
