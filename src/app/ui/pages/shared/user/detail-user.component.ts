import {ChangeDetectorRef, Component, Input, OnDestroy} from '@angular/core';
import {User} from 'app/model/user';
import {PermissionsService} from 'app/service/permissions.service';
import {Project} from 'app/model/project';
import {ConfigDao, UsersDao} from 'app/service/dao';
import {map, takeUntil} from 'rxjs/operators';
import {combineLatest, Subject} from 'rxjs';

@Component({
  selector: 'detail-user',
  templateUrl: './detail-user.component.html',
  styleUrls: ['./detail-user.component.scss']
})
export class DetailUserComponent implements OnDestroy {
  user: User;

  canEditWhitelist: boolean;

  isWhitelisted: boolean;

  _userEmail: string;
  @Input('userEmail') set userEmail(userEmail: string) {
    this._userEmail = userEmail;
    this.user = null;
    if (!this._userEmail) { return; }

    this.usersDao.getByEmail(this.userEmail).subscribe(user => {
      this.user = user ? user : {email: this.userEmail};
      this.updateWhitelist();
      this.changeDetectorRef.markForCheck();
    });
  }
  get userEmail(): string { return this._userEmail; }

  @Input() group: 'lead' | 'director' | 'acquisitions';

  @Input()
  _project: Project;
  @Input() set project(project: Project) {
    this._project = project;
    this.updateWhitelist();
  }
  get project(): Project { return this._project; }

  canEditWhitelistAndEditsEnabled = false;

  private destroyed = new Subject();

  constructor(private usersDao: UsersDao,
              private permissionsService: PermissionsService,
              private configDao: ConfigDao,
              private changeDetectorRef: ChangeDetectorRef) {
    const changes = [
      this.permissionsService.isAcquisitions,
      this.configDao.values.pipe(map(values => values ? values.get('editsDisabled') : false))
    ];

    combineLatest(changes).pipe(takeUntil(this.destroyed)).subscribe(result => {
      this.canEditWhitelistAndEditsEnabled = result[0] && !result[1];
    });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  showWhitelistToggle() {
    if (!this.canEditWhitelistAndEditsEnabled) { return false; }

    return this.group === 'lead' || this.group === 'director';
  }

  updateWhitelist() {
    if (!this.user || !this.project) { return; }

    this.isWhitelisted = this.permissionsService.isUserWhitelisted(this.user.email, this.project);
  }

  toggleWhitelisted() {
    this.permissionsService.toggleWhitelisted(this.user, this.project);
  }
}
