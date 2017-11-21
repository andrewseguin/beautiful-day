import {ProjectComponent} from './ui/pages/project/project.component';
import {InventoryComponent} from './ui/pages/inventory/inventory.component';
import {ProjectDetailsComponent} from './ui/pages/project/details/project-details.component';
import {ProjectNotesComponent} from './ui/pages/project/notes/project-notes.component';
import {ProjectRequestsComponent} from './ui/pages/project/requests/project-requests.component';
import {CanActivateAuthGuard} from './route-guard/can-activate-auth-guard';
import {LoginComponent} from './ui/login/login.component';
import {HomeComponent} from './ui/pages/home/home.component';
import {PagesComponent} from './ui/pages/pages.component';
import {FeedbackComponent} from './ui/pages/feedback/feedback.component';
import {CanActivateFeedbackGuard} from './route-guard/can-activate-feedback-guard';
import {EventsComponent} from './ui/pages/events/events.component';
import {CanActivateNotesGuard} from './route-guard/can-activate-notes-guard';
import {CanActivateAcquisitionsGuard} from './route-guard/can-activate-acquisitions-guard';
import {ReportingComponent} from './ui/pages/reporting/reporting.component';
import {PrintComponent} from './ui/print/print.component';

export type TopLevelSection = 'project' | 'inventory' | 'login' | 'home' | 'reporting';

export const ROUTER_CONFIG = [
  {path: '', component: PagesComponent, children: [
    // Projects
    {path: 'project/:id',
      component: ProjectComponent,
      canActivate: [CanActivateAuthGuard],
      children: [
        {path: '', redirectTo: 'details', pathMatch: 'full'},
        {path: 'details', component: ProjectDetailsComponent},
        {path: 'notes', component: ProjectNotesComponent,
          canActivate: [CanActivateNotesGuard]},
        {path: 'notes/:noteId', component: ProjectNotesComponent},
        {path: 'requests', redirectTo: 'requests/all'},
        {path: 'requests/:group', component: ProjectRequestsComponent}
      ]},

    // Home
    {path: 'home',
      component: HomeComponent,
      canActivate: [CanActivateAuthGuard]},

    // Events
    {path: 'events',
      component: EventsComponent,
      canActivate: [CanActivateAuthGuard]},

    // Acquisitions
    {path: 'inventory',
      component: InventoryComponent,
      canActivate: [CanActivateAuthGuard, CanActivateAcquisitionsGuard]},
    {path: 'reporting',
      component: ReportingComponent,
      canActivate: [CanActivateAuthGuard, CanActivateAcquisitionsGuard]},
    {path: 'reporting/:id',
      component: ReportingComponent,
      canActivate: [CanActivateAuthGuard, CanActivateAcquisitionsGuard]},

    // Owner
    {path: 'feedback',
      component: FeedbackComponent,
      canActivate: [CanActivateAuthGuard, CanActivateFeedbackGuard]},

    // Redirect
    {path: '', redirectTo: '/home', pathMatch: 'full'},
  ]},
  {path: 'login', component: LoginComponent},
  {path: 'print/:type/:id', component: PrintComponent}
];
