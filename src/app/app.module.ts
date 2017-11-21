import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {RouterModule} from '@angular/router';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatIconRegistry,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';
import {AngularFireModule} from 'angularfire2';
import 'hammerjs';
import {FIREBASE_CONFIG} from './firebase.config';
import {ROUTER_CONFIG} from './router.config';
import {AppComponent} from './app.component';
import {NavComponent} from './ui/shared/nav/nav.component';
import {ProjectComponent} from './ui/pages/project/project.component';
import {ProjectsService} from './service/projects.service';
import {InventoryComponent} from './ui/pages/inventory/inventory.component';
import {ItemsService} from './service/items.service';
import {RequestsService} from './service/requests.service';
import {RequestComponent} from './ui/shared/requests-list/request/request.component';
import {ProjectDetailsComponent} from './ui/pages/project/details/project-details.component';
import {ProjectNotesComponent} from './ui/pages/project/notes/project-notes.component';
import {ProjectRequestsComponent} from './ui/pages/project/requests/project-requests.component';
import {InventoryPanelComponent} from './ui/pages/project/requests/inventory-panel/inventory-panel.component';
import {ProjectNavComponent} from './ui/shared/header/project-nav/project-nav.component';
import {SelectionHeaderComponent} from './ui/shared/selection-header/selection-header.component';
import {EditDropoffComponent} from './ui/shared/dialog/edit-dropoff/edit-dropoff.component';
import {MediaQueryService} from './service/media-query.service';
import {CanActivateAuthGuard} from './route-guard/can-activate-auth-guard';
import {LoginComponent} from './ui/login/login.component';
import {SubheaderService} from './service/subheader.service';
import {EditProjectComponent} from './ui/shared/dialog/edit-project/edit-project.component';
import {SafeUrlPipe} from './pipe/safe-url.pipe';
import {DeleteProjectComponent} from './ui/shared/dialog/delete-project/delete-project.component';
import {UsersService} from './service/users.service';
import {HomeComponent} from './ui/pages/home/home.component';
import {HeaderService} from './service/header.service';
import {HeaderComponent} from './ui/shared/header/header.component';
import {DetailUserComponent} from './ui/pages/project/details/user/detail-user.component';
import {NotesService} from './service/notes.service';
import {DeleteNoteComponent} from './ui/shared/dialog/delete-note/delete-note.component';
import {EditItemComponent} from './ui/shared/dialog/edit-item/edit-item.component';
import {EditRequestOptionsComponent} from './ui/shared/selection-header/edit-request-options/edit-request-options.component';
import {EditItemOptionsComponent} from './ui/shared/selection-header/edit-item-options/edit-item-options.component';
import {EditItemNameComponent} from './ui/shared/dialog/edit-item-name/edit-item-name.component';
import {EditItemCategoryComponent} from './ui/shared/dialog/edit-item-category/edit-item-category.component';
import {SlidingPanelComponent} from './ui/pages/project/requests/inventory-panel/sliding-panel/sliding-panel.component';
import {ItemSearchPipe} from './pipe/item-search.pipe';
import {InventoryPanelItemComponent} from './ui/pages/project/requests/inventory-panel/inventory-panel-item/inventory-panel-item.component';
import {InventorySearchComponent} from './ui/pages/project/requests/inventory-panel/inventory-search/inventory-search.component';
import {InventoryListComponent} from './ui/pages/project/requests/inventory-panel/inventory-list/inventory-list.component';
import {RequestsGroupComponent} from './ui/shared/requests-list/requests-group/requests-group.component';
import {PagesComponent} from './ui/pages/pages.component';
import {RequestSortPipe} from './pipe/request-sort.pipe';
import {EditTagsComponent} from './ui/shared/dialog/edit-tags/edit-tags.component';
import {SetValuesPipe} from './pipe/set-values.pipe';
import {PromptDialogComponent} from './ui/shared/dialog/prompt-dialog/prompt-dialog.component';
import {EditUserProfileComponent} from './ui/shared/dialog/edit-user-profile/edit-user-profile.component';
import {RemainingBudgetComponent} from './ui/pages/project/requests/remaining-budget/remaining-budget.component';
import {AccountingService} from './service/accounting.service';
import {PermissionsService} from './service/permissions.service';
import {FeedbackComponent} from './ui/pages/feedback/feedback.component';
import {CanActivateFeedbackGuard} from './route-guard/can-activate-feedback-guard';
import {FeedbackService} from './service/feedback.service';
import {EventsService} from './service/events.service';
import {EditEventComponent} from './ui/shared/dialog/edit-event/edit-event.component';
import {EventDatePipe} from './pipe/event-date.pipe';
import {EventsComponent} from './ui/pages/events/events.component';
import {ImportItemsComponent} from './ui/shared/dialog/import-items/import-items.component';
import {EditGroupComponent} from './ui/shared/dialog/edit-group/edit-group.component';
import {GroupsService} from './service/groups.service';
import {CanActivateNotesGuard} from './route-guard/can-activate-notes-guard';
import {DeleteRequestsComponent} from './ui/shared/dialog/delete-requests/delete-requests.component';
import {AnalyticsService} from './service/analytics.service';
import {CanActivateAcquisitionsGuard} from './route-guard/can-activate-acquisitions-guard';
import {DisplayOptionsHeaderComponent} from './ui/shared/requests-list/display-options-header/display-options-header.component';
import {RequestsListComponent} from './ui/shared/requests-list/requests-list.component';
import {ReportingComponent} from './ui/pages/reporting/reporting.component';
import {ReportsService} from './service/reports.service';
import {QueryStagesComponent} from './ui/pages/reporting/query-stages/query-stages.component';
import {ReportComponent} from './ui/pages/reporting/report/report.component';
import {ReportListComponent} from './ui/pages/reporting/report-list/report-list.component';
import {PrintComponent} from './ui/print/print.component';
import {ReportQueryService} from './service/report-query.service';
import {EditApprovalStatusDialogComponent} from './ui/shared/dialog/edit-approval-status/edit-approval-status';
import {EditPurchaseStatusDialogComponent} from './ui/shared/dialog/edit-purchase-status/edit-purchase-status';
import {DeleteReportComponent} from './ui/shared/dialog/delete-report/delete-report.component';
import {ReportSearchPipe} from './pipe/report-search.pipe';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

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
    DeleteNoteComponent,
    DeleteRequestsComponent,
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
    EditGroupComponent,
    FeedbackComponent,
    EditEventComponent,
    ImportItemsComponent,
    EventDatePipe,
    EventsComponent,
    DisplayOptionsHeaderComponent,
    RequestsListComponent,
    ReportingComponent,
    QueryStagesComponent,
    ReportComponent,
    ReportListComponent,
    PrintComponent,
    EditApprovalStatusDialogComponent,
    EditPurchaseStatusDialogComponent,
    DeleteReportComponent,
    ReportSearchPipe,
  ],
  entryComponents: [
    EditItemComponent,
    EditItemCategoryComponent,
    EditItemNameComponent,
    EditDropoffComponent,
    EditProjectComponent,
    EditTagsComponent,
    EditUserProfileComponent,
    DeleteNoteComponent,
    DeleteRequestsComponent,
    ImportItemsComponent,
    DeleteProjectComponent,
    PromptDialogComponent,
    EditGroupComponent,
    EditEventComponent,
    EditApprovalStatusDialogComponent,
    EditPurchaseStatusDialogComponent,
    DeleteReportComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(ROUTER_CONFIG),

    // Material
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatSnackBarModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatNativeDateModule,
  ],
  providers: [
    MatIconRegistry,
    ProjectsService,
    ItemsService,
    RequestsService,
    MediaQueryService,
    SubheaderService,
    UsersService,
    CanActivateAuthGuard,
    CanActivateFeedbackGuard,
    CanActivateNotesGuard,
    CanActivateAcquisitionsGuard,
    HeaderService,
    NotesService,
    AccountingService,
    PermissionsService,
    FeedbackService,
    GroupsService,
    EventsService,
    AnalyticsService,
    ReportsService,
    ReportQueryService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
