import {Component, Input} from '@angular/core';
import {Group, GroupsService} from 'app/service/groups.service';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'editable-group',
  styleUrls: ['editable-group.component.scss'],
  templateUrl: 'editable-group.component.html'
})
export class EditableGroupComponent {
  emails: string[];
  showNew = false;
  newEntry = new FormControl('', Validators.required);

  @Input() group: Group;

  constructor(private groupsService: GroupsService) { }

  ngOnInit() {
    this.groupsService.getGroup(this.group).subscribe(emails => {
      this.emails = emails;
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
    this.groupsService.set(this.group, this.emails.join(','));
  }
}
