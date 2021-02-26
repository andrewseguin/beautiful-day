import {NgModule} from '@angular/core';
import {AngularFireModule} from '@angular/fire';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import { MatIconRegistry } from '@angular/material/icon';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import {ServiceWorkerModule} from '@angular/service-worker';
import {Login} from 'app/login/login';
import {LoginModule} from 'app/login/login.module';
import {Theme} from 'app/season/services/theme';
import {GlobalConfigDao} from 'app/service/global-config-dao';
import {SeasonsDao} from 'app/service/seasons-dao';
import {environment} from '../environments/environment';
import {App} from './app';
import {FIREBASE_CONFIG, FIREBASE_CONFIG_DEV} from './firebase.config';
import {UsersDao} from './service/users-dao';

@NgModule({
  declarations: [App],
  imports: [
    AngularFireModule.initializeApp(environment.production ? FIREBASE_CONFIG : FIREBASE_CONFIG_DEV),
    AngularFireAuthModule,
    AngularFirestoreModule,
    BrowserAnimationsModule,
    LoginModule,
    RouterModule.forRoot([
    { path: 'login', component: Login },
    {
        path: ':season',
        loadChildren: () => import('app/season/season.module').then(m => m.SeasonModule)
    },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
], { relativeLinkResolution: 'legacy' }),
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
