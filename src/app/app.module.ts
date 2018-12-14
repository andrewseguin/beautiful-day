import {NgModule} from '@angular/core';
import {AngularFireModule} from '@angular/fire';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {MatIconRegistry} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import {ServiceWorkerModule} from '@angular/service-worker';
import {Login} from 'app/login/login';
import {LoginModule} from 'app/login/login.module';
import {Theme} from 'app/season/services/theme';
import {GlobalConfigDao} from 'app/service/global-config-dao';
import {SeasonsDao} from 'app/service/seasons-dao';
import 'hammerjs';
import {environment} from '../environments/environment';
import {App} from './app';
import {FIREBASE_CONFIG} from './firebase.config';
import {UsersDao} from './service/users-dao';

@NgModule({
  declarations: [App],
  imports: [
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireAuthModule,
    AngularFirestoreModule.enablePersistence(),
    BrowserAnimationsModule,
    LoginModule,
    RouterModule.forRoot([
      {path: 'login', component: Login},
      {
        path: ':season',
        loadChildren: 'app/season/season.module#SeasonModule'
      },
      {path: '', redirectTo: 'login', pathMatch: 'full'},
    ]),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [
    MatIconRegistry,
    UsersDao,
    GlobalConfigDao,
    SeasonsDao,
    Theme,
  ],
  bootstrap: [App]
})
export class AppModule { }
