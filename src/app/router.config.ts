import {ProjectComponent} from "./ui/project/project.component";
import {InventoryComponent} from "./ui/inventory/inventory.component";
import {ProjectDetailsComponent} from "./ui/project/details/project-details.component";
import {ProjectNotesComponent} from "./ui/project/notes/project-notes.component";
import {ProjectRequestsComponent} from "./ui/project/requests/project-requests.component";
import {CanActivateViaAuthGuard} from "./auth-guard";
import {LoginComponent} from "./ui/login/login.component";
import {HomeComponent} from "./ui/home/home.component";

export type TopLevelSection = 'project' | 'inventory' | 'login' | 'home';

export const ROUTER_CONFIG = [
  { path: 'project/:id', component: ProjectComponent, canActivate: [CanActivateViaAuthGuard],
    children: [
      { path: '', redirectTo: 'details', pathMatch: 'full' },
      { path: 'details', component: ProjectDetailsComponent },
      { path: 'notes', component: ProjectNotesComponent },
      { path: 'notes/:noteId', component: ProjectNotesComponent },
      { path: 'requests', redirectTo: 'requests/all'},
      { path: 'requests/:group', component: ProjectRequestsComponent },
    ]
  },
  { path: 'inventory', component: InventoryComponent },
  { path: 'login', component: LoginComponent},
  { path: 'home', component: HomeComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];
