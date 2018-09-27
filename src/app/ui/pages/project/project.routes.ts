import {ProjectRequestsComponent} from './requests/project-requests.component';

export const PROJECT_ROUTES = [
  {path: '', redirectTo: 'details', pathMatch: 'full'},
  {path: 'requests', redirectTo: 'requests/all'},
  {path: 'requests/:group', component: ProjectRequestsComponent}
];
