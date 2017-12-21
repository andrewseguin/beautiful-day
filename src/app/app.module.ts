import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {RouterModule} from '@angular/router';
import {AngularFireModule} from 'angularfire2';
import 'hammerjs';
import {FIREBASE_CONFIG} from './firebase.config';
import {ROUTER_CONFIG} from './router.config';
import {AppComponent} from './app.component';
import {ProjectComponent} from './ui/pages/project/project.component';
import {ProjectsService} from './service/projects.service';
import {InventoryComponent} from './ui/pages/inventory/inventory.component';
import {ItemsService} from './service/items.service';
import {RequestsService} from './service/requests.service';
import {ProjectDetailsComponent} from './ui/pages/project/details/project-details.component';
import {ProjectNotesComponent} from './ui/pages/project/notes/project-notes.component';
import {ProjectRequestsComponent} from './ui/pages/project/requests/project-requests.component';
import {InventoryPanelComponent} from './ui/pages/project/requests/inventory-panel/inventory-panel.component';
import {MediaQueryService} from './service/media-query.service';
import {CanActivateAuthGuard} from './route-guard/can-activate-auth-guard';
import {LoginComponent} from './ui/login/login.component';
import {SubheaderService} from './service/subheader.service';
import {UsersService} from './service/users.service';
import {HomeComponent} from './ui/pages/home/home.component';
import {HeaderService} from './service/header.service';
import {DetailUserComponent} from './ui/pages/project/details/user/detail-user.component';
import {NotesService} from './service/notes.service';
import {SlidingPanelComponent} from './ui/pages/project/requests/inventory-panel/sliding-panel/sliding-panel.component';
import {InventoryPanelItemComponent} from './ui/pages/project/requests/inventory-panel/inventory-panel-item/inventory-panel-item.component';
import {InventorySearchComponent} from './ui/pages/project/requests/inventory-panel/inventory-search/inventory-search.component';
import {InventoryListComponent} from './ui/pages/project/requests/inventory-panel/inventory-list/inventory-list.component';
import {PagesComponent} from './ui/pages/pages.component';
import {RemainingBudgetComponent} from './ui/pages/project/requests/remaining-budget/remaining-budget.component';
import {AccountingService} from './service/accounting.service';
import {PermissionsService} from './service/permissions.service';
import {FeedbackComponent} from './ui/pages/feedback/feedback.component';
import {CanActivateFeedbackGuard} from './route-guard/can-activate-feedback-guard';
import {FeedbackService} from './service/feedback.service';
import {EventsService} from './service/events.service';
import {EventsComponent} from './ui/pages/events/events.component';
import {GroupsService} from './service/groups.service';
import {CanActivateNotesGuard} from './route-guard/can-activate-notes-guard';
import {AnalyticsService} from './service/analytics.service';
import {CanActivateAcquisitionsGuard} from './route-guard/can-activate-acquisitions-guard';
import {ReportingComponent} from './ui/pages/reporting/reporting.component';
import {ReportsService} from './service/reports.service';
import {QueryStagesComponent} from './ui/pages/reporting/query-stages/query-stages.component';
import {ReportComponent} from './ui/pages/reporting/report/report.component';
import {ReportListComponent} from './ui/pages/reporting/report-list/report-list.component';
import {ReportQueryService} from './service/report-query.service';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SubcategoryListComponent} from './ui/pages/project/requests/inventory-panel/subcategory-list/subcategory-list.component';
import {EditableItemCellValueComponent} from './ui/pages/inventory/editable-item-cell-value/editable-item-cell-value.component';
import {PrintModule} from 'app/ui/print/print.module';
import {RequestsListModule} from 'app/ui/shared/requests-list/requests-list.module';
import {SelectionHeaderModule} from 'app/ui/shared/selection-header/selection-header.module';
import {NavModule} from 'app/ui/shared/nav/nav.module';
import {HeaderModule} from 'app/ui/shared/header/header.module';
import {MaterialModule} from 'app/material.module';
import {MatIconRegistry} from '@angular/material';
import {DialogModule} from 'app/ui/shared/dialog/dialog.module';
import {PipeModule} from 'app/pipe/pipe.module';

@NgModule({
  declarations: [
    DetailUserComponent,
    EditableItemCellValueComponent,
    EventsComponent,
    FeedbackComponent,
    HomeComponent,
    InventoryComponent,
    InventoryListComponent,
    InventoryPanelComponent,
    InventoryPanelItemComponent,
    InventorySearchComponent,
    LoginComponent,
    PagesComponent,
    ProjectComponent,
    ProjectDetailsComponent,
    ProjectNotesComponent,
    ProjectRequestsComponent,
    QueryStagesComponent,
    RemainingBudgetComponent,
    ReportComponent,
    ReportListComponent,
    ReportingComponent,
    SlidingPanelComponent,
    SubcategoryListComponent,
    AppComponent,
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
    MaterialModule,

    // Mine
    PrintModule,
    RequestsListModule,
    SelectionHeaderModule,
    NavModule,
    HeaderModule,
    DialogModule,
    PipeModule,
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
