import {CanActivateFeedbackGuard} from 'app/route-guard/can-activate-feedback-guard';
import {CanActivateAuthGuard} from 'app/route-guard/can-activate-auth-guard';
import {FeedbackComponent} from './feedback/feedback.component';
import {CanActivateAcquisitionsGuard} from 'app/route-guard/can-activate-acquisitions-guard';
import {ReportingComponent} from './reporting/reporting.component';
import {InventoryComponent} from './inventory/inventory.component';
import {EventsComponent} from './events/events.component';
import {ProjectsComponent} from './projects/projects.component';
import {ProjectComponent} from './project/project.component';
import {PROJECT_ROUTES} from './project/project.routes';
import {AdminComponent} from './admin/admin.component';
import {HelpComponent} from './help/help.component';

export type TopLevelSection = 'project' | 'inventory' | 'login' | 'home' | 'reporting';

export const PAGES_ROUTES = [
  {path: 'project/:id', component: ProjectComponent, children: PROJECT_ROUTES,
    canActivate: [CanActivateAuthGuard]},

  // Home
  {path: 'projects', component: ProjectsComponent,
    canActivate: [CanActivateAuthGuard]},

  // Admin
  {path: 'admin', component: AdminComponent,
    canActivate: [CanActivateAuthGuard]},

  // Help
  {path: 'help', component: HelpComponent,
    canActivate: [CanActivateAuthGuard]},

  // Events
  {path: 'events', component: EventsComponent,
    canActivate: [CanActivateAuthGuard]},

  // Acquisitions
  {path: 'inventory', component: InventoryComponent,
    canActivate: [CanActivateAuthGuard, CanActivateAcquisitionsGuard]},

  {path: 'reporting', component: ReportingComponent,
    canActivate: [CanActivateAuthGuard, CanActivateAcquisitionsGuard]},
  {path: 'reporting/:id', component: ReportingComponent,
    canActivate: [CanActivateAuthGuard, CanActivateAcquisitionsGuard]},

  // Owner
  {path: 'feedback', component: FeedbackComponent,
    canActivate: [CanActivateAuthGuard, CanActivateFeedbackGuard]},

  // Redirect
  {path: '', redirectTo: '/projects', pathMatch: 'full'},
];
