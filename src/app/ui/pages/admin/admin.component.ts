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
    {label: 'Groups', id: 'manage-groups'},
    {label: 'Projects', id: 'manage-projects'},
    {label: 'Events', id: 'events'},
    {label: 'Extras', id: 'extras'},
  ];

  selectedSection: Section = this.sections[0];
}
