import {Component, Input} from '@angular/core';
import {UsersService} from 'app/service/users.service';
import {User} from 'app/model/user';
import {PermissionsService} from 'app/service/permissions.service';
import {Project} from 'app/model/project';
import {ProjectsService} from 'app/service/projects.service';

@Component({
  selector: 'detail-user',
  templateUrl: './detail-user.component.html',
  styleUrls: ['./detail-user.component.scss']
})
export class DetailUserComponent {
  user: User;

  canEditWhitelist: boolean;

  isWhitelisted: boolean;

  _userEmail: string;
  @Input('userEmail') set userEmail(userEmail: string) {
    this._userEmail = userEmail;
    this.user = null;
    if (!this._userEmail) { return; }

    this.usersService.getByEmail(this.userEmail).subscribe(user => {
      this.user = user ? user : {email: this.userEmail};
      this.updateWhitelist();
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

  constructor(private usersService: UsersService,
              private permissionsService: PermissionsService) {
    this.permissionsService.canManageAcquisitions().subscribe(v => this.canEditWhitelist = v);
  }

  showWhitelistToggle() {
    if (!this.canEditWhitelist || !this.permissionsService.editsDisabled) { return false; }

    return this.group === 'lead' || this.group === 'director';
  }

  updateWhitelist() {
    if (!this.user || !this.project) { return; }

    this.isWhitelisted = this.permissionsService.isUserWhitelisted(this.user, this.project);
  }

  toggleWhitelisted() {
    this.permissionsService.toggleWhitelisted(this.user, this.project);
  }
}
