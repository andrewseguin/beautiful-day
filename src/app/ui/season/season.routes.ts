import {CanActivateAuthGuard} from 'app/route-guard/can-activate-auth-guard';
import {CanActivateAcquisitionsGuard} from 'app/route-guard/can-activate-acquisitions-guard';
import {InventoryComponent} from './inventory/inventory.component';
import {EventsComponent} from './events/events.component';
import {ProjectsComponent} from './projects/projects.component';
import {ProjectComponent} from './project/project.component';
import {AdminComponent} from './admin/admin.component';
import {HelpComponent} from './help/help.component';
import {ReportComponent} from 'app/ui/season/report/report.component';
import {ReportsComponent} from 'app/ui/season/reports/reports.component';

export type TopLevelSection = 'projects' | 'inventory' | 'login' |
                              'home' | 'reports' | 'events' |
                              'help' | 'report';

export const SEASON_ROUTES = [
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

  // Redirect
  {path: '', redirectTo: 'projects', pathMatch: 'full'},
];
