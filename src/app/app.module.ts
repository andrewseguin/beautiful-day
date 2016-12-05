import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {RouterModule} from "@angular/router";
import {MaterialModule, MdIconRegistry} from '@angular/material';
import {AngularFireModule} from 'angularfire2';
import 'hammerjs';

import {FIREBASE_CONFIG, FIREBASE_AUTH} from './firebase.config';
import {ROUTER_CONFIG} from './router.config';

import {AppComponent} from './app.component';
import {NavComponent} from './ui/nav/nav.component';
import {ProjectComponent} from './ui/project/project.component';
import {ProjectsService} from './service/projects.service';
import { InventoryComponent } from './ui/inventory/inventory.component';
import {ItemsService} from "./service/items.service";
import {CategoriesService} from "./service/categories.service";
import {RequestsService} from "./service/requests.service";
import { RequestComponent } from './ui/project/requests/request/request.component';
import { ProjectDetailsComponent } from './ui/project/details/project-details.component';
import { ProjectNotesComponent } from './ui/project/notes/project-notes.component';
import { ProjectRequestsComponent } from './ui/project/requests/project-requests.component';
import { InventoryPanelComponent } from './ui/project/requests/inventory-panel/inventory-panel.component';
import { ProjectNavComponent } from './ui/project/nav/project-nav.component';
import { SelectionHeaderComponent } from './ui/selection-header/selection-header.component';
import { EditNoteComponent } from './ui/dialog/edit-note/edit-note.component';
import { EditDropoffComponent } from './ui/dialog/edit-dropoff/edit-dropoff.component';
import {MediaQueryService} from "./service/media-query.service";
import {RequestGroupingService} from "./service/request-grouping.service";
import {CanActivateViaAuthGuard} from "./auth-guard";
import { LoginComponent } from './ui/login/login.component';
import {SubheaderService} from "./service/subheader.service";
import { EditProjectComponent } from './ui/dialog/edit-project/edit-project.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    ProjectComponent,
    InventoryComponent,
    RequestComponent,
    ProjectDetailsComponent,
    ProjectNotesComponent,
    ProjectRequestsComponent,
    InventoryPanelComponent,
    ProjectNavComponent,
    SelectionHeaderComponent,
    EditNoteComponent,
    EditDropoffComponent,
    LoginComponent,
    EditProjectComponent,
  ],
  entryComponents: [
    EditNoteComponent,
    EditDropoffComponent,
    EditProjectComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule.forRoot(),
    AngularFireModule.initializeApp(FIREBASE_CONFIG, FIREBASE_AUTH),
    RouterModule.forRoot(ROUTER_CONFIG)
  ],
  providers: [
    MdIconRegistry,
    ProjectsService,
    ItemsService,
    CategoriesService,
    RequestsService,
    MediaQueryService,
    RequestGroupingService,
    SubheaderService,
    CanActivateViaAuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
