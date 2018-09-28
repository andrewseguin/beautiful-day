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
    {label: 'Extras', id: 'extras'},
    {label: 'Manage Projects', id: 'manage-projects'},
  ];

  selectedSection: Section = this.sections[0];
}
