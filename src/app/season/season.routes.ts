import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';
import {Permissions} from 'app/season/services';
import {Observable} from 'rxjs';

export const SEASON_ROUTES = [
  {
    path: 'projects',
    loadChildren: () => import('app/season/projects-page/projects-page.module').then(m => m.ProjectsPageModule)
  },
  {
    path: 'project/:id',
    loadChildren: () => import('app/season/project-page/project-page.module').then(m => m.ProjectPageModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('app/season/admin-page/admin-page.module').then(m => m.AdminPageModule)
  },
  {
    path: 'help',
    loadChildren: () => import('app/season/help-page/help-page.module').then(m => m.HelpPageModule)
  },
  {
    path: 'events',
    loadChildren: () => import('app/season/events-page/events-page.module').then(m => m.EventsPageModule)
  },
  {
    path: 'inventory',
    loadChildren: () => import('app/season/inventory-page/inventory-page.module').then(m => m.InventoryPageModule)
  },
  {
    path: 'allocation',
    loadChildren: () => import('app/season/allocation-page/allocation-page.module').then(m => m.AllocationPageModule)
  },
  {
    path: 'reports',
    loadChildren: () => import('app/season/reports-page/reports-page.module').then(m => m.ReportsPageModule)
  },
  {
    path: 'report/:id',
    loadChildren: () => import('app/season/report-page/report-page.module').then(m => m.ReportPageModule)
  },
  {
    path: 'print',
    loadChildren: () => import('app/season/print-page/print-page.module').then(m => m.PrintPageModule)
  },

  // Redirect
  {path: '', redirectTo: 'projects', pathMatch: 'full'},
];
