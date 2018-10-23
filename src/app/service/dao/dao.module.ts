import {NgModule} from '@angular/core';
import {
  ConfigDao,
  EventsDao,
  GroupsDao,
  ItemsDao,
  ProjectsDao,
  ReportsDao,
  RequestsDao,
  UsersDao
} from 'app/service/dao';
import {AngularFirestoreModule} from '@angular/fire/firestore';

@NgModule({
  imports: [
    AngularFirestoreModule
  ],
  providers: [
    ConfigDao,
    EventsDao,
    GroupsDao,
    ItemsDao,
    ProjectsDao,
    ReportsDao,
    RequestsDao,
    UsersDao,
  ],
})
export class DaoModule { }
