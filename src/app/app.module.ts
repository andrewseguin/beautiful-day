import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AngularFireModule} from '@angular/fire';
import 'hammerjs';
import {FIREBASE_CONFIG} from './firebase.config';
import {App} from './app';
import {CanActivateAuthGuard} from './route-guard/can-activate-auth-guard';
import {Analytics} from './service/analytics';
import {CanActivateAcquisitionsGuard} from './route-guard/can-activate-acquisitions-guard';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatIconRegistry, MatSortModule, MatTableModule} from '@angular/material';
import {LoginModule} from 'app/ui/login/login.module';
import {SeasonModule} from 'app/ui/season/season.module';
import {RouterModule} from '@angular/router';
import {Season} from 'app/ui/season/season';
import {SEASON_ROUTES} from 'app/ui/season/season.routes';
import {Login} from 'app/ui/login/login';
import {UsersDao} from './service/users-dao';
import {GlobalConfigDao} from 'app/service/global-config-dao';

@NgModule({
  declarations: [App],
  imports: [
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireAuthModule,
    BrowserAnimationsModule,
    LoginModule,
    SeasonModule,
    RouterModule.forRoot([
      {path: '', redirectTo: '2018', pathMatch: 'full'},
      {path: ':season', component: Season, children: SEASON_ROUTES},
      {path: 'login', component: Login},
    ]),
  ],
  providers: [
    MatIconRegistry,
    CanActivateAuthGuard,
    CanActivateAcquisitionsGuard,
    Analytics,
    UsersDao,
    GlobalConfigDao,
  ],
  bootstrap: [App]
})
export class AppModule { }
