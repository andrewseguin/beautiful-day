import {InventoryPage} from './inventory-page/inventory-page';
import {EventsPage} from './events-page/events-page';
import {ProjectsPage} from './projects-page/projects-page';
import {ProjectPage} from './project-page/project-page';
import {AdminPage} from './admin-page/admin-page';
import {HelpPage} from './help-page/help-page';
import {ReportPage} from './report-page/report-page';
import {ReportsPage} from './reports-page/reports-page';
import {ExportPage} from './export-page/export-page';
import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';
import {Permissions} from 'app/ui/season/services';
import {Observable} from 'rxjs';

@Injectable()
export class CanActivateAcquisitionsGuard implements CanActivate {
  constructor(private permissions: Permissions) {}
  canActivate(): Observable<boolean> {
    return this.permissions.isAcquisitions;
  }
}

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
  {path: 'inventory', component: InventoryPage},

  // Reports
  {path: 'reports', component: ReportsPage},

  // Report
  {path: 'report/:id', component: ReportPage},

  // Export
  {path: 'export', component: ExportPage},

  // Redirect
  {path: '', redirectTo: 'projects', pathMatch: 'full'},
];
