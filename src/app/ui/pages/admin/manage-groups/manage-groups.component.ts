import {Component} from '@angular/core';

@Component({
  selector: 'manage-groups',
  styleUrls: ['manage-groups.component.scss'],
  templateUrl: 'manage-groups.component.html'
})
export class ManageGroupsComponent {
  groups = [
    'admins', 'acquisitions', 'approvers', 'owners'
  ];
}
