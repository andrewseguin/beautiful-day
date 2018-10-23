import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {Report} from 'app/model/report';
import {ActivatedRoute, Router} from '@angular/router';
import {HeaderService} from 'app/service/header.service';
import {CdkPortal} from '@angular/cdk/portal';
import {
  areOptionStatesEqual,
  RequestRendererOptions,
  RequestRendererOptionsState
} from 'app/ui/pages/shared/requests-list/render/request-renderer-options';
import {Subject, Subscription} from 'rxjs';
import {ReportDialog} from 'app/ui/pages/shared/dialog/report.dialog';
import {ReportsDao} from 'app/service/dao';

@Component({
  templateUrl: 'report.component.html',
  styleUrls: ['report.component.scss']
})
export class ReportComponent implements OnInit {
  set report(report: Report) {
    // When a report is set, the options state should be updated to be
    // whatever the report is, and the title should always match
    this._report = report;
    this.currentOptions = this.report.options;
    this.headerService.title.next(this.report.name);
  }
  get report(): Report { return this._report; }
  private _report: Report;

  set currentOptions(currentOptions: RequestRendererOptionsState) {
    // When current options change, a check should be evaluated if they differ
    // from the current report's options. If so, the save button should display.
    this._currentOptions = currentOptions;
    this.canSave = this.report && this.report.options && this.currentOptions &&
      !areOptionStatesEqual(this.report.options, this.currentOptions);
  }
  get currentOptions(): RequestRendererOptionsState { return this._currentOptions; }
  private _currentOptions: RequestRendererOptionsState;

  canSave: boolean;

  private destroyed = new Subject();
  private reportGetSubscription: Subscription;

  @ViewChild(CdkPortal) toolbarActions: CdkPortal;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private headerService: HeaderService,
              private snackbar: MatSnackBar,
              private reportDialog: ReportDialog,
              private reportsDao: ReportsDao) {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.canSave = false;

      if (this.reportGetSubscription) {
        this.reportGetSubscription.unsubscribe();
      }

      if (id === 'new') {
        this.report = createNewReport();
      } else {
        this.reportGetSubscription = this.reportsDao.get(id)
          .subscribe(report => this.report = report);
      }
    });
  }

  ngOnInit() {
    this.headerService.toolbarOutlet = this.toolbarActions;
  }

  ngOnDestroy() {
    this.headerService.toolbarOutlet = null;
    this.destroyed.next();
    this.destroyed.complete();
  }

  saveAs() {
    this.reportDialog.saveAsReport(this.currentOptions);
  }

  save() {
    this.reportsDao.update(this.report.id, {options: this.currentOptions});
  }
}

function createNewReport() {
  // Initial report should always show project names and filter to the
  // latest season (hard-coded for now)
  const options = new RequestRendererOptions();
  options.showProjectName = true;
  options.filters.push({type: 'season', query: {season: '2018'}});
  return {name: 'New Report', options: options.getState()};
}
