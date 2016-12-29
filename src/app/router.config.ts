import {ProjectComponent} from "./ui/pages/project/project.component";
import {InventoryComponent} from "./ui/pages/inventory/inventory.component";
import {ProjectDetailsComponent} from "./ui/pages/project/details/project-details.component";
import {ProjectNotesComponent} from "./ui/pages/project/notes/project-notes.component";
import {ProjectRequestsComponent} from "./ui/pages/project/requests/project-requests.component";
import {CanActivateViaAuthGuard} from "./auth-guard";
import {LoginComponent} from "./ui/login/login.component";
import {HomeComponent} from "./ui/pages/home/home.component";

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
