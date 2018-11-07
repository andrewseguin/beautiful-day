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
import {HttpClientModule} from '@angular/common/http';
import {SeasonsDao} from 'app/service/seasons-dao';
import {AngularFirestoreModule} from '@angular/fire/firestore';

@NgModule({
  declarations: [App],
  imports: [
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireAuthModule,
    AngularFirestoreModule,
    BrowserAnimationsModule,
    HttpClientModule,
    LoginModule,
    RouterModule.forRoot([
      {path: 'login', component: Login},
      {
        path: ':season',
        loadChildren: 'app/season/season.module#SeasonModule'
      },
      {path: '', redirectTo: 'login', pathMatch: 'full'},
    ]),
  ],
  providers: [
    MatIconRegistry,
    Analytics,
    UsersDao,
    GlobalConfigDao,
    SeasonsDao,
  ],
  bootstrap: [App]
})
export class AppModule { }
