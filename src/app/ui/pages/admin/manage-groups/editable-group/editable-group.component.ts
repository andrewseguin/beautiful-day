import {Component, Input} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {GroupId, GroupsDao} from 'app/service/dao';

@Component({
  selector: 'editable-group',
  styleUrls: ['editable-group.component.scss'],
  templateUrl: 'editable-group.component.html'
})
export class EditableGroupComponent {
  emails: string[];
  showNew = false;
  newEntry = new FormControl('', Validators.required);

  @Input() group: GroupId;

  constructor(private groupsDao: GroupsDao) { }

  ngOnInit() {
    this.groupsDao.get(this.group).subscribe(group => {
      this.emails = group.users;
    });
  }

  remove(email: string) {
    this.emails.splice(this.emails.indexOf(email), 1);
    this._update();
  }

  add() {
    this.emails.push(this.newEntry.value);
    this.newEntry.setValue('');
    this.showNew = false;
    this._update();
  }

  _update() {
    this.groupsDao.update(this.group, {users: this.emails});
  }
}
