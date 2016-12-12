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
import { ProjectNavComponent } from './ui/header/project-nav/project-nav.component';
import { SelectionHeaderComponent } from './ui/selection-header/selection-header.component';
import { EditNoteComponent } from './ui/dialog/edit-note/edit-note.component';
import { EditDropoffComponent } from './ui/dialog/edit-dropoff/edit-dropoff.component';
import {MediaQueryService} from "./service/media-query.service";
import {RequestGroupingService} from "./service/request-grouping.service";
import {CanActivateViaAuthGuard} from "./auth-guard";
import { LoginComponent } from './ui/login/login.component';
import {SubheaderService} from "./service/subheader.service";
import { EditProjectComponent } from './ui/dialog/edit-project/edit-project.component';
import { SafeUrlPipe } from './pipe/safe-url.pipe';
import { DeleteProjectComponent } from './ui/dialog/delete-project/delete-project.component';
import {UsersService} from "./service/users.service";
import { HomeComponent } from './ui/home/home.component';
import {HeaderService} from "./service/header.service";
import { HeaderComponent } from './ui/header/header.component';
import { DetailUserComponent } from './ui/project/details/user/detail-user.component';
import {NotesService} from "./service/notes.service";
import { EditNoteTitleComponent } from './ui/dialog/edit-note-title/edit-note-title.component';
import { DeleteNoteComponent } from './ui/dialog/delete-note/delete-note.component';

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
    SafeUrlPipe,
    DeleteProjectComponent,
    HomeComponent,
    HeaderComponent,
    DetailUserComponent,
    EditNoteTitleComponent,
    DeleteNoteComponent,
  ],
  entryComponents: [
    EditNoteComponent,
    EditNoteTitleComponent,
    EditDropoffComponent,
    EditProjectComponent,
    DeleteNoteComponent,
    DeleteProjectComponent,
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
    UsersService,
    CanActivateViaAuthGuard,
    HeaderService,
    NotesService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
