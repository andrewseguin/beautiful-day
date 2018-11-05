import {NgModule} from '@angular/core';
import {AngularFireModule} from '@angular/fire';
import 'hammerjs';
import {FIREBASE_CONFIG} from './firebase.config';
import {App} from './app';
import {Analytics} from './service/analytics';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatIconRegistry} from '@angular/material';
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
      {path: 'login', component: Login},
      {path: ':season', component: Season, children: SEASON_ROUTES},
      {path: '', redirectTo: '2018', pathMatch: 'full'},
    ]),
  ],
  providers: [
    MatIconRegistry,
    Analytics,
    UsersDao,
    GlobalConfigDao,
  ],
  bootstrap: [App]
})
export class AppModule { }
