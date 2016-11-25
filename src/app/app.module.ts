import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {RouterModule} from "@angular/router";
import {MaterialModule, MdIconRegistry} from '@angular/material';
import {AngularFireModule} from 'angularfire2';

import {FIREBASE_CONFIG} from './firebase.config';
import {ROUTER_CONFIG} from './router.config';

import {AppComponent} from './app.component';
import {NavComponent} from './ui/nav/nav.component';
import {ProjectComponent} from './ui/project/project.component';
import {ProjectsService} from './service/projects.service';
import { InventoryComponent } from './ui/inventory/inventory.component';
import {ItemsService} from "./service/items.service";
import {CategoriesService} from "./service/categories.service";
import {RequestsService} from "./service/requests.service";
import { RequestComponent } from './ui/project/project-requests/request/request.component';
import { ProjectDetailsComponent } from './ui/project/details/project-details.component';
import { ProjectNotesComponent } from './ui/project/project-notes/project-notes.component';
import { ProjectRequestsComponent } from './ui/project/project-requests/project-requests.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    ProjectComponent,
    InventoryComponent,
    RequestComponent,
    ProjectDetailsComponent,
    ProjectNotesComponent,
    ProjectRequestsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule,
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    RouterModule.forRoot(ROUTER_CONFIG)
  ],
  providers: [
    MdIconRegistry,
    ProjectsService,
    ItemsService,
    CategoriesService,
    RequestsService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
