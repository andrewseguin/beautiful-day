import {CanActivateAuthGuard} from 'app/route-guard/can-activate-auth-guard';
import {CanActivateAcquisitionsGuard} from 'app/route-guard/can-activate-acquisitions-guard';
import {InventoryPage} from './inventory-page/inventory-page';
import {EventsPage} from './events-page/events-page';
import {ProjectsPage} from './projects-page/projects-page';
import {ProjectPage} from './project-page/project-page';
import {AdminPage} from './admin-page/admin-page';
import {HelpPage} from './help-page/help-page';
import {ReportPage} from './report-page/report-page';
import {ReportsPage} from './reports-page/reports-page';
import {ExportPage} from './export-page/export-page';

export type TopLevelSection = 'projects' | 'inventory' | 'login' |
                              'home' | 'reports' | 'events' |
                              'help' | 'report';

export const SEASON_ROUTES = [
  {path: 'project/:id', component: ProjectPage,
    canActivate: [CanActivateAuthGuard]},

  // Home
  {path: 'projects', component: ProjectsPage,
    canActivate: [CanActivateAuthGuard]},

  // Admin
  {path: 'admin', component: AdminPage,
    canActivate: [CanActivateAuthGuard]},

  // Help
  {path: 'help', component: HelpPage,
    canActivate: [CanActivateAuthGuard]},

  // Events
  {path: 'events', component: EventsPage,
    canActivate: [CanActivateAuthGuard]},

  // Acquisitions
  {path: 'inventory', component: InventoryPage,
    canActivate: [CanActivateAuthGuard, CanActivateAcquisitionsGuard]},

  // Reports
  {path: 'reports', component: ReportsPage,
    canActivate: [CanActivateAuthGuard, CanActivateAcquisitionsGuard]},

  // Report
  {path: 'report/:id', component: ReportPage,
    canActivate: [CanActivateAuthGuard, CanActivateAcquisitionsGuard]},

  // Export
  {path: 'export', component: ExportPage},

  // Redirect
  {path: '', redirectTo: 'projects', pathMatch: 'full'},
];
