import {CanActivateFeedbackGuard} from 'app/route-guard/can-activate-feedback-guard';
import {CanActivateAuthGuard} from 'app/route-guard/can-activate-auth-guard';
import {FeedbackComponent} from './feedback/feedback.component';
import {CanActivateAcquisitionsGuard} from 'app/route-guard/can-activate-acquisitions-guard';
import {InventoryComponent} from './inventory/inventory.component';
import {EventsComponent} from './events/events.component';
import {ProjectsComponent} from './projects/projects.component';
import {ProjectComponent} from './project/project.component';
import {AdminComponent} from './admin/admin.component';
import {HelpComponent} from './help/help.component';
import {ReportComponent} from 'app/ui/pages/report/report.component';
import {ReportsComponent} from 'app/ui/pages/reports/reports.component';

export type TopLevelSection = 'projects' | 'inventory' | 'login' |
                              'home' | 'reports' | 'events' | 'feedback' |
                              'help' | 'report';

export const PAGES_ROUTES = [
  {path: 'project/:id', component: ProjectComponent,
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

  // Reports
  {path: 'reports', component: ReportsComponent,
    canActivate: [CanActivateAuthGuard, CanActivateAcquisitionsGuard]},

  // Report
  {path: 'report', component: ReportComponent,
    canActivate: [CanActivateAuthGuard, CanActivateAcquisitionsGuard]},
  {path: 'report/:id', component: ReportComponent,
    canActivate: [CanActivateAuthGuard, CanActivateAcquisitionsGuard]},

  // Owner
  {path: 'feedback', component: FeedbackComponent,
    canActivate: [CanActivateAuthGuard, CanActivateFeedbackGuard]},

  // Redirect
  {path: '', redirectTo: '/projects', pathMatch: 'full'},
];
