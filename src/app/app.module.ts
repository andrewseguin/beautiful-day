import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AngularFireModule} from '@angular/fire';
import 'hammerjs';
import {FIREBASE_CONFIG} from './firebase.config';
import {AppComponent} from './app.component';
import {CanActivateAuthGuard} from './route-guard/can-activate-auth-guard';
import {HeaderService} from './service/header.service';
import {AccountingService} from './service/accounting.service';
import {PermissionsService} from './service/permissions.service';
import {AnalyticsService} from './service/analytics.service';
import {CanActivateAcquisitionsGuard} from './route-guard/can-activate-acquisitions-guard';
import {AngularFireAuthModule} from '@angular/fire/auth';
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
import {DaoModule} from 'app/service/dao/dao.module';
import {Selection} from 'app/service';

@NgModule({
  declarations: [AppComponent, ExportPage],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireAuthModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatSortModule,
    DaoModule,
    LoginModule,
    PagesModule,
    PrintModule,
    RouterModule.forRoot([
      {path: '', component: PagesComponent, children: PAGES_ROUTES},
      {path: 'login', component: LoginComponent},
      {path: 'export', component: ExportPage},
      {path: 'print/:type/:id', component: PrintComponent}
    ]),
  ],
  providers: [
    Selection,
    MatIconRegistry,
    CanActivateAuthGuard,
    CanActivateAcquisitionsGuard,
    HeaderService,
    AccountingService,
    PermissionsService,
    AnalyticsService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
