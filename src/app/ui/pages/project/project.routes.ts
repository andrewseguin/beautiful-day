import {ProjectRequestsComponent} from './requests/project-requests.component';
import {ProjectNotesComponent} from './notes/project-notes.component';
import {ProjectDetailsComponent} from './details/project-details.component';
import {CanActivateNotesGuard} from 'app/route-guard/can-activate-notes-guard';

export const PROJECT_ROUTES = [
  {path: '', redirectTo: 'details', pathMatch: 'full'},
  {path: 'details', component: ProjectDetailsComponent},
  {path: 'notes', component: ProjectNotesComponent, canActivate: [CanActivateNotesGuard]},
  {path: 'notes/:noteId', component: ProjectNotesComponent},
  {path: 'requests', redirectTo: 'requests/all'},
  {path: 'requests/:group', component: ProjectRequestsComponent}
];
