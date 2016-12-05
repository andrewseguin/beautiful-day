import {ProjectComponent} from "./ui/project/project.component";
import {InventoryComponent} from "./ui/inventory/inventory.component";
import {ProjectDetailsComponent} from "./ui/project/details/project-details.component";
import {ProjectNotesComponent} from "./ui/project/notes/project-notes.component";
import {ProjectRequestsComponent} from "./ui/project/requests/project-requests.component";
import {CanActivateViaAuthGuard} from "./auth-guard";
import {LoginComponent} from "./ui/login/login.component";

export const ROUTER_CONFIG = [
  { path: 'project/:id', component: ProjectComponent, canActivate: [CanActivateViaAuthGuard],
    children: [
      { path: '', redirectTo: 'details', pathMatch: 'full' },
      { path: 'details', component: ProjectDetailsComponent },
      { path: 'notes', component: ProjectNotesComponent },
      { path: 'requests', redirectTo: 'requests/all'},
      { path: 'requests/:group', component: ProjectRequestsComponent },
    ]
  },
  { path: 'inventory', component: InventoryComponent },
  { path: 'login', component: LoginComponent},
  { path: '', component: ProjectComponent, canActivate: [CanActivateViaAuthGuard]
  },
];
