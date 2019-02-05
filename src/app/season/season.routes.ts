import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';
import {Permissions} from 'app/season/services';
import {Observable} from 'rxjs';

export const SEASON_ROUTES = [
  {
    path: 'projects',
    loadChildren: 'app/season/projects-page/projects-page.module#ProjectsPageModule'
  },
  {
    path: 'project/:id',
    loadChildren: 'app/season/project-page/project-page.module#ProjectPageModule'
  },
  {
    path: 'admin',
    loadChildren: 'app/season/admin-page/admin-page.module#AdminPageModule'
  },
  {
    path: 'help',
    loadChildren: 'app/season/help-page/help-page.module#HelpPageModule'
  },
  {
    path: 'events',
    loadChildren: 'app/season/events-page/events-page.module#EventsPageModule'
  },
  {
    path: 'inventory',
    loadChildren: 'app/season/inventory-page/inventory-page.module#InventoryPageModule'
  },
  {
    path: 'allocation',
    loadChildren: 'app/season/allocation-page/allocation-page.module#AllocationPageModule'
  },
  {
    path: 'reports',
    loadChildren: 'app/season/reports-page/reports-page.module#ReportsPageModule'
  },
  {
    path: 'report/:id',
    loadChildren: 'app/season/report-page/report-page.module#ReportPageModule'
  },
  {
    path: 'print',
    loadChildren: 'app/season/print-page/print-page.module#PrintPageModule'
  },

  // Redirect
  {path: '', redirectTo: 'projects', pathMatch: 'full'},
];
