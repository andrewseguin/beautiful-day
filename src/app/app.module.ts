import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {RouterModule} from "@angular/router";
import {MaterialModule, MdIconRegistry} from "@angular/material";
import {AngularFireModule} from "angularfire2";
import "hammerjs";
import {FIREBASE_CONFIG, FIREBASE_AUTH} from "./firebase.config";
import {ROUTER_CONFIG} from "./router.config";
import {AppComponent} from "./app.component";
import {NavComponent} from "./ui/shared/nav/nav.component";
import {ProjectComponent} from "./ui/pages/project/project.component";
import {ProjectsService} from "./service/projects.service";
import {InventoryComponent} from "./ui/pages/inventory/inventory.component";
import {ItemsService} from "./service/items.service";
import {RequestsService} from "./service/requests.service";
import {RequestComponent} from "./ui/pages/project/requests/request/request.component";
import {ProjectDetailsComponent} from "./ui/pages/project/details/project-details.component";
import {ProjectNotesComponent} from "./ui/pages/project/notes/project-notes.component";
import {ProjectRequestsComponent} from "./ui/pages/project/requests/project-requests.component";
import {InventoryPanelComponent} from "./ui/pages/project/requests/inventory-panel/inventory-panel.component";
import {ProjectNavComponent} from "./ui/shared/header/project-nav/project-nav.component";
import {SelectionHeaderComponent} from "./ui/shared/selection-header/selection-header.component";
import {EditDropoffComponent} from "./ui/shared/dialog/edit-dropoff/edit-dropoff.component";
import {MediaQueryService} from "./service/media-query.service";
import {RequestGroupingService} from "./service/request-grouping.service";
import {CanActivateViaAuthGuard} from "./auth-guard";
import {LoginComponent} from "./ui/login/login.component";
import {SubheaderService} from "./service/subheader.service";
import {EditProjectComponent} from "./ui/shared/dialog/edit-project/edit-project.component";
import {SafeUrlPipe} from "./pipe/safe-url.pipe";
import {DeleteProjectComponent} from "./ui/shared/dialog/delete-project/delete-project.component";
import {UsersService} from "./service/users.service";
import {HomeComponent} from "./ui/pages/home/home.component";
import {HeaderService} from "./service/header.service";
import {HeaderComponent} from "./ui/shared/header/header.component";
import {DetailUserComponent} from "./ui/pages/project/details/user/detail-user.component";
import {NotesService} from "./service/notes.service";
import {EditNoteTitleComponent} from "./ui/shared/dialog/edit-note-title/edit-note-title.component";
import {DeleteNoteComponent} from "./ui/shared/dialog/delete-note/delete-note.component";
import {EditItemComponent} from "./ui/shared/dialog/edit-item/edit-item.component";
import {EditRequestOptionsComponent} from "./ui/shared/selection-header/edit-request-options/edit-request-options.component";
import {EditItemOptionsComponent} from "./ui/shared/selection-header/edit-item-options/edit-item-options.component";
import {EditItemNameComponent} from "./ui/shared/dialog/edit-item-name/edit-item-name.component";
import {EditItemCategoryComponent} from "./ui/shared/dialog/edit-item-category/edit-item-category.component";
import {SlidingPanelComponent} from "./ui/pages/project/requests/inventory-panel/sliding-panel/sliding-panel.component";
import {ItemSearchPipe} from "./pipe/item-search.pipe";
import {InventoryPanelItemComponent} from "./ui/pages/project/requests/inventory-panel/inventory-panel-item/inventory-panel-item.component";
import {InventorySearchComponent} from "./ui/pages/project/requests/inventory-panel/inventory-search/inventory-search.component";
import {InventoryListComponent} from "./ui/pages/project/requests/inventory-panel/inventory-list/inventory-list.component";
import {RequestsGroupComponent} from "./ui/pages/project/requests/requests-group/requests-group.component";
import {PagesComponent} from "./ui/pages/pages.component";
import {RequestSortPipe} from "./pipe/request-sort.pipe";
import {EditTagsComponent} from "./ui/shared/dialog/edit-tags/edit-tags.component";
import {SetValuesPipe} from "./pipe/set-values.pipe";
import {PromptDialogComponent} from "./ui/shared/dialog/prompt-dialog/prompt-dialog.component";
import {EditUserProfileComponent} from "./ui/shared/dialog/edit-user-profile/edit-user-profile.component";
import {RemainingBudgetComponent} from "./ui/pages/project/requests/remaining-budget/remaining-budget.component";
import {AccountingService} from "./service/accounting.service";
import {PermissionsService} from "./service/permissions.service";

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
    EditItemComponent,
    EditRequestOptionsComponent,
    EditItemOptionsComponent,
    EditItemNameComponent,
    EditItemCategoryComponent,
    EditTagsComponent,
    EditUserProfileComponent,
    SlidingPanelComponent,
    ItemSearchPipe,
    InventoryPanelItemComponent,
    InventorySearchComponent,
    InventoryListComponent,
    RequestsGroupComponent,
    PagesComponent,
    RequestSortPipe,
    SetValuesPipe,
    PromptDialogComponent,
    RemainingBudgetComponent,
  ],
  entryComponents: [
    EditItemComponent,
    EditItemCategoryComponent,
    EditItemNameComponent,
    EditNoteTitleComponent,
    EditDropoffComponent,
    EditProjectComponent,
    EditTagsComponent,
    EditUserProfileComponent,
    DeleteNoteComponent,
    DeleteProjectComponent,
    PromptDialogComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule.forRoot(),
    AngularFireModule.initializeApp(FIREBASE_CONFIG, FIREBASE_AUTH),
    RouterModule.forRoot(ROUTER_CONFIG),
  ],
  providers: [
    MdIconRegistry,
    ProjectsService,
    ItemsService,
    RequestsService,
    MediaQueryService,
    RequestGroupingService,
    SubheaderService,
    UsersService,
    CanActivateViaAuthGuard,
    HeaderService,
    NotesService,
    AccountingService,
    PermissionsService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
