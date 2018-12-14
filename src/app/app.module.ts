import {NgModule} from '@angular/core';
import {AngularFireModule} from '@angular/fire';
import 'hammerjs';
import {FIREBASE_CONFIG} from './firebase.config';
import {App} from './app';
import {Analytics} from './service/analytics';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatIconRegistry} from '@angular/material';
import {LoginModule} from 'app/login/login.module';
import {RouterModule} from '@angular/router';
import {Login} from 'app/login/login';
import {UsersDao} from './service/users-dao';
import {GlobalConfigDao} from 'app/service/global-config-dao';
import {SeasonsDao} from 'app/service/seasons-dao';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {Theme} from 'app/season/services/theme';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

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
    Analytics,
    UsersDao,
    GlobalConfigDao,
    SeasonsDao,
    Theme,
  ],
  bootstrap: [App]
})
export class AppModule { }
