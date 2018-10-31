import {Component, Input} from '@angular/core';
import {EditItemComponent} from 'app/ui/season/shared/dialog/edit-item/edit-item.component';
import {MatDialog} from '@angular/material';
import {Project} from 'app/model/project';
import {Item} from 'app/model/item';
import {Request} from 'app/model/request';
import {ProjectsDao, RequestsDao} from 'app/ui/season/dao';
import {Selection} from 'app/ui/season/services';

@Component({
  selector: 'inventory-item',
  templateUrl: './inventory-item.component.html',
  styleUrls: ['./inventory-item.component.scss'],
  host: {
    '(click)': 'setSelected(!isSelected())'
  }
})
export class InventoryItemComponent {
  @Input() item: Item;

  projectsMap: Map<string, Project>;
  requests: Request[];
  requestsGroupedByProject = new Map<string, Request[]>();
  requestedProjects: string[] = [];

  constructor(private projectsDao: ProjectsDao,
              private requestsDao: RequestsDao,
              private selection: Selection,
              private mdDialog: MatDialog) { }

  ngOnInit() {
    this.projectsDao.map.subscribe(projectsMap => {
      this.projectsMap = projectsMap;
      this.updateRequestsDisplay();
    });

    this.requestsDao.list.subscribe(requests => {
      this.requests = requests.filter(r => r.item === this.item.id);
      this.updateRequestsDisplay();
    });
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
    const dialogRef = this.mdDialog.open(EditItemComponent);
    dialogRef.componentInstance.mode = 'edit';
    dialogRef.componentInstance.item = this.item;
  }

  openItemUrl() {
    window.open(this.item.url);
  }
}
