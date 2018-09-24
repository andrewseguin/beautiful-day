import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AngularFireModule} from '@angular/fire';
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
import {TitleService} from './service/header.service';
import {AccountingService} from './service/accounting.service';
import {PermissionsService} from './service/permissions.service';
import {CanActivateFeedbackGuard} from './route-guard/can-activate-feedback-guard';
import {FeedbackService} from './service/feedback.service';
import {EventsService} from './service/events.service';
import {GroupsService} from './service/groups.service';
import {AnalyticsService} from './service/analytics.service';
import {CanActivateAcquisitionsGuard} from './route-guard/can-activate-acquisitions-guard';
import {ReportsService} from './service/reports.service';
import {ReportQueryService} from './service/report-query.service';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {PrintModule} from 'app/ui/print/print.module';
import {MatIconRegistry, MatSortModule, MatTableModule} from '@angular/material';
import {LoginModule} from 'app/ui/login/login.module';
import {PagesModule} from 'app/ui/pages/pages.module';
import {RouterModule} from '@angular/router';
import {PagesComponent} from 'app/ui/pages/pages.component';
import {PAGES_ROUTES} from 'app/ui/pages/pages.routes';
import {PrintComponent} from 'app/ui/print/print.component';
import {LoginComponent} from 'app/ui/login/login.component';
import {ExportPage} from 'app/ui/pages/export/export';
import {AuthService} from 'app/service/auth-service';

@NgModule({
  declarations: [AppComponent, ExportPage],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatSortModule,

    RouterModule.forRoot([
      {path: '', component: PagesComponent, children: PAGES_ROUTES},
      {path: 'login', component: LoginComponent},
      {path: 'export', component: ExportPage},
      {path: 'print/:type/:id', component: PrintComponent}
    ]),

    LoginModule,
    PagesModule,
    PrintModule,
  ],
  providers: [
    AuthService,
    MatIconRegistry,
    ProjectsService,
    ItemsService,
    RequestsService,
    MediaQueryService,
    SubheaderService,
    UsersService,
    CanActivateAuthGuard,
    CanActivateFeedbackGuard,
    CanActivateAcquisitionsGuard,
    TitleService,
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
