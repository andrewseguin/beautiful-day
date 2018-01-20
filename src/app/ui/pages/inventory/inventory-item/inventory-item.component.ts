import {Component, Input} from '@angular/core';
import {ItemsService} from 'app/service/items.service';
import {EditItemComponent} from 'app/ui/pages/shared/dialog/edit-item/edit-item.component';
import {MatDialog} from '@angular/material';
import {RequestsService} from 'app/service/requests.service';
import {ProjectsService} from 'app/service/projects.service';
import {Project} from 'app/model/project';
import {Item} from 'app/model/item';
import {Request} from 'app/model/request';

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

  constructor(private itemsService: ItemsService,
              private projectsService: ProjectsService,
              private requestsService: RequestsService,
              private mdDialog: MatDialog) { }

  ngOnInit() {
    this.projectsService.projectsMap.subscribe(projectsMap => {
      this.projectsMap = projectsMap;
      this.updateRequestsDisplay();
    });

    this.requestsService.requestsByItem.subscribe(requestsByItem => {
      this.requests = requestsByItem.get(this.item.$key);
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
    this.requestedProjects.sort((a, b) => {
      const projectA = this.projectsMap.get(a);
      const projectB = this.projectsMap.get(b);

      if ((projectA.season.concat(projectA.name)) < (projectB.season.concat(projectB.name))) {
        return -1;
      } else {
        return 1;
      }
    });
  }

  isSelected(): boolean {
    return this.itemsService.selection.isSelected(this.item.$key);
  }

  setSelected(checked: boolean) {
    const selection = this.itemsService.selection;
    checked ? selection.select(this.item.$key) : selection.deselect(this.item.$key);
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
