import {CanActivateAuthGuard} from 'app/route-guard/can-activate-auth-guard';
import {CanActivateAcquisitionsGuard} from 'app/route-guard/can-activate-acquisitions-guard';
import {Inventory} from './inventory/inventory';
import {Events} from './events/events';
import {ProjectsPage} from './projects/projects-page';
import {ProjectPage} from './project/project-page';
import {Admin} from './admin/admin';
import {Help} from './help/help';
import {ReportPage} from 'app/ui/season/report/report-page';
import {ReportsPage} from 'app/ui/season/reports/reports-page';

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
  {path: 'admin', component: Admin,
    canActivate: [CanActivateAuthGuard]},

  // Help
  {path: 'help', component: Help,
    canActivate: [CanActivateAuthGuard]},

  // Events
  {path: 'events', component: Events,
    canActivate: [CanActivateAuthGuard]},

  // Acquisitions
  {path: 'inventory', component: Inventory,
    canActivate: [CanActivateAuthGuard, CanActivateAcquisitionsGuard]},

  // Reports
  {path: 'reports', component: ReportsPage,
    canActivate: [CanActivateAuthGuard, CanActivateAcquisitionsGuard]},

  // Report
  {path: 'report/:id', component: ReportPage,
    canActivate: [CanActivateAuthGuard, CanActivateAcquisitionsGuard]},

  // Redirect
  {path: '', redirectTo: 'projects', pathMatch: 'full'},
];
