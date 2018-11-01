import {Component} from '@angular/core';

interface Section {
  label: string;
  id: string;
}

@Component({
  styleUrls: ['admin.scss'],
  templateUrl: 'admin.html'
})
export class Admin {
  sections: Section[] = [
    {label: 'Groups', id: 'manage-groups'},
    {label: 'Projects', id: 'manage-projects'},
    {label: 'Events', id: 'events'},
    {label: 'Extras', id: 'extras'},
  ];

  selectedSection: Section = this.sections[2];
}
