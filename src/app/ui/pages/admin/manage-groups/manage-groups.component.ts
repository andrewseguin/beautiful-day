import {Component} from '@angular/core';
import {GroupsService} from '../../../../service/groups.service';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'manage-groups',
  styleUrls: ['manage-groups.component.scss'],
  templateUrl: 'manage-groups.component.html'
})
export class ManageGroupsComponent {
  admins: string[];
  showNew = false;
  newEntry = new FormControl('', Validators.required);

  constructor(private groupsService: GroupsService) {
    this.groupsService.getGroup('admins').subscribe(admins => {
      this.admins = admins;
    });
  }

  remove(email: string) {
    this.admins.splice(this.admins.indexOf(email), 1);
    this._update();
  }

  add() {
    this.admins.push(this.newEntry.value);
    this.newEntry.setValue('');
    this.showNew = false;
    this._update();
  }

  _update() {
    this.groupsService.set('admins', this.admins.join(','));
  }
}
