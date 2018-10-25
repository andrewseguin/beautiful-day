import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AngularFireModule} from '@angular/fire';
import 'hammerjs';
import {FIREBASE_CONFIG} from './firebase.config';
import {AppComponent} from './app.component';
import {CanActivateAuthGuard} from './route-guard/can-activate-auth-guard';
import {AnalyticsService} from './service/analytics.service';
import {CanActivateAcquisitionsGuard} from './route-guard/can-activate-acquisitions-guard';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {PrintModule} from 'app/ui/print/print.module';
import {MatIconRegistry, MatSortModule, MatTableModule} from '@angular/material';
import {LoginModule} from 'app/ui/login/login.module';
import {SeasonModule} from 'app/ui/season/season.module';
import {RouterModule} from '@angular/router';
import {SeasonComponent} from 'app/ui/season/season.component';
import {SEASON_ROUTES} from 'app/ui/season/season.routes';
import {PrintComponent} from 'app/ui/print/print.component';
import {LoginComponent} from 'app/ui/login/login.component';
import {ExportPage} from 'app/ui/season/export/export';
import {UsersDao} from './service/users-dao';

@NgModule({
  declarations: [AppComponent, ExportPage],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireAuthModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatSortModule,
    LoginModule,
    SeasonModule,
    PrintModule,
    RouterModule.forRoot([
      {path: '', redirectTo: '2018', pathMatch: 'full'},
      {path: ':season', component: SeasonComponent, children: SEASON_ROUTES},
      {path: 'login', component: LoginComponent},
      {path: 'export', component: ExportPage},
      {path: 'print/:type/:id', component: PrintComponent}
    ]),
  ],
  providers: [
    MatIconRegistry,
    CanActivateAuthGuard,
    CanActivateAcquisitionsGuard,
    AnalyticsService,
    UsersDao,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
