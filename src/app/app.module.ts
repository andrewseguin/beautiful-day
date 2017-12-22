import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AngularFireModule} from 'angularfire2';
import 'hammerjs';
import {FIREBASE_CONFIG} from './firebase.config';
import {AppComponent} from './app.component';
import {ProjectsService} from './service/projects.service';
import {ItemsService} from './service/items.service';
import {RequestsService} from './service/requests.service';
import {MediaQueryService} from './service/media-query.service';
import {CanActivateAuthGuard} from './route-guard/can-activate-auth-guard';
import {SubheaderService} from './service/subheader.service';
import {UsersService} from './service/users.service';
import {HeaderService} from './service/header.service';
import {NotesService} from './service/notes.service';
import {AccountingService} from './service/accounting.service';
import {PermissionsService} from './service/permissions.service';
import {CanActivateFeedbackGuard} from './route-guard/can-activate-feedback-guard';
import {FeedbackService} from './service/feedback.service';
import {EventsService} from './service/events.service';
import {GroupsService} from './service/groups.service';
import {CanActivateNotesGuard} from './route-guard/can-activate-notes-guard';
import {AnalyticsService} from './service/analytics.service';
import {CanActivateAcquisitionsGuard} from './route-guard/can-activate-acquisitions-guard';
import {ReportsService} from './service/reports.service';
import {ReportQueryService} from './service/report-query.service';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {PrintModule} from 'app/ui/print/print.module';
import {MatIconRegistry} from '@angular/material';
import {LoginModule} from 'app/ui/login/login.module';
import {PagesModule} from 'app/ui/pages/pages.module';
import {RouterModule} from '@angular/router';
import {PagesComponent} from 'app/ui/pages/pages.component';
import {PAGES_ROUTES} from 'app/ui/pages/pages.routes';
import {PrintComponent} from 'app/ui/print/print.component';
import {LoginComponent} from 'app/ui/login/login.component';
import {DialogModule} from 'app/ui/shared/dialog/dialog.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    BrowserAnimationsModule,

    RouterModule.forRoot([
      {path: '', component: PagesComponent, children: PAGES_ROUTES},
      {path: 'login', component: LoginComponent},
      {path: 'print/:type/:id', component: PrintComponent}
    ]),

    LoginModule,
    PagesModule,
    PrintModule,
    DialogModule,
  ],
  providers: [
    MatIconRegistry,
    ProjectsService,
    ItemsService,
    RequestsService,
    MediaQueryService,
    SubheaderService,
    UsersService,
    CanActivateAuthGuard,
    CanActivateFeedbackGuard,
    CanActivateNotesGuard,
    CanActivateAcquisitionsGuard,
    HeaderService,
    NotesService,
    AccountingService,
    PermissionsService,
    FeedbackService,
    GroupsService,
    EventsService,
    AnalyticsService,
    ReportsService,
    ReportQueryService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
