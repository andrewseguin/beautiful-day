import {Component} from '@angular/core';

interface Section {
  label: string;
  id: string;
}

@Component({
  styleUrls: ['admin.component.scss'],
  templateUrl: 'admin.component.html'
})
export class AdminComponent {
  sections: Section[] = [
    {label: 'Manage Groups', id: 'manage-groups'},
    {label: 'Manage Projects', id: 'manage-projects'},
    {label: 'Extras', id: 'extras'},
  ];

  selectedSection: Section = this.sections[0];
}
