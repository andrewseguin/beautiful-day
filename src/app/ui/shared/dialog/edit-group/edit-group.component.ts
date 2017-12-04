import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {GroupsService, Group} from 'app/service/groups.service';

@Component({
  selector: 'edit-group',
  templateUrl: './edit-group.component.html',
  styleUrls: ['./edit-group.component.scss']
})
export class EditGroupComponent implements OnInit {
  group: Group;
  members: string[];

  constructor(private dialogRef: MatDialogRef<EditGroupComponent>,
              private groupsService: GroupsService) {}

  ngOnInit() {
    this.groupsService.getGroup(this.group)
        .subscribe(members => this.members = members);
  }

  remove(index: number) {
    this.members.splice(index, 1);
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    this.groupsService.setMembers(this.group, this.members);
    this.close();
  }

  trackByIndex(index: number) {
    return index;
  }

  getMemberName(plural = false) {
    switch (this.group) {
      case 'admins': return plural ? 'Admins' : 'Admin';
      case 'acquisitions': return plural ? 'Acquisition Team' : 'Acquisition Member';
      case 'approvers': return plural ? 'Approver Team' : 'Approver Member';
    }
  }
}
