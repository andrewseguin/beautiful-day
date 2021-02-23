import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {Header} from 'app/season/services/header';
import {CdkPortal} from '@angular/cdk/portal';
import {
  areOptionStatesEqual,
  RequestRendererOptions,
  RequestRendererOptionsState
} from 'app/season/services/requests-renderer/request-renderer-options';
import {Subject, Subscription} from 'rxjs';
import {ReportDialog} from 'app/season/shared/dialog/report/report-dialog';
import {Report, ReportsDao} from 'app/season/dao';
import {takeUntil} from 'rxjs/operators';
import {ActivatedSeason} from 'app/season/services';

@Component({
  templateUrl: 'report-page.html',
  styleUrls: ['report-page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportPage implements OnInit {
  set report(report: Report) {
    // When a report is set, the options state should be updated to be
    // whatever the report is, and the title should always match
    this._report = report;
    this.currentOptions = this.report.options;
    this.header.title.next(this.report.name);
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

  @ViewChild(CdkPortal, { static: true }) toolbarActions: CdkPortal;

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private activatedSeason: ActivatedSeason,
              private header: Header,
              private snackbar: MatSnackBar,
              private reportDialog: ReportDialog,
              private cd: ChangeDetectorRef,
              private reportsDao: ReportsDao) {
    this.activatedRoute.params.pipe(takeUntil(this.destroyed)).subscribe(params => {
      const id = params['id'];
      this.canSave = false;

      if (this.reportGetSubscription) {
        this.reportGetSubscription.unsubscribe();
      }

      if (id === 'new') {
        this.report = createNewReport();
        this.cd.markForCheck();
      } else {
        this.reportGetSubscription = this.reportsDao.get(id)
          .pipe(takeUntil(this.destroyed))
          .subscribe(report => {
            if (report) {
              this.report = report;
            } else {
              this.router.navigate([`reports`],
                  {relativeTo: this.activatedRoute.parent});
            }
            this.cd.markForCheck();
          });
      }
    });
  }

  ngOnInit() {
    this.header.toolbarOutlet.next(this.toolbarActions);
  }

  ngOnDestroy() {
    this.header.toolbarOutlet.next(null);
    this.destroyed.next();
    this.destroyed.complete();
  }

  saveAs() {
    this.reportDialog.saveAsReport(
        this.currentOptions, this.activatedSeason.season.value);
  }

  save() {
    this.reportsDao.update(this.report.id, {options: this.currentOptions});
  }
}

function createNewReport() {
  const options = new RequestRendererOptions();
  options.showProjectName = true;
  options.showRequester = true;
  return {name: 'New Report', options: options.getState()};
}
