import {ProjectRequestsComponent} from './requests/project-requests.component';
import {ProjectDetailsComponent} from './details/project-details.component';

export const PROJECT_ROUTES = [
  {path: '', redirectTo: 'details', pathMatch: 'full'},
  {path: 'details', component: ProjectDetailsComponent},
  {path: 'requests', redirectTo: 'requests/all'},
  {path: 'requests/:group', component: ProjectRequestsComponent}
];
