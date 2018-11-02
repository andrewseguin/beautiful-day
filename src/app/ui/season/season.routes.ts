import {AuthGuard} from 'app/route-guard/auth-guard';
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
  {path: 'project/:id', component: ProjectPage},

  // Home
  {path: 'projects', component: ProjectsPage},

  // Admin
  {path: 'admin', component: AdminPage},

  // Help
  {path: 'help', component: HelpPage},

  // Events
  {path: 'events', component: EventsPage},

  // Acquisitions
  {path: 'inventory', component: InventoryPage,
    canActivate: [CanActivateAcquisitionsGuard]},

  // Reports
  {path: 'reports', component: ReportsPage,
    canActivate: [CanActivateAcquisitionsGuard]},

  // Report
  {path: 'report/:id', component: ReportPage,
    canActivate: [CanActivateAcquisitionsGuard]},

  // Export
  {path: 'export', component: ExportPage},

  // Redirect
  {path: '', redirectTo: 'projects', pathMatch: 'full'},
];
