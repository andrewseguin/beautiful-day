import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {PermissionsService} from '../service/permissions.service';

@Injectable()
export class CanActivateFeedbackGuard implements CanActivate {

  constructor(private permissionsService: PermissionsService) {}

  canActivate(): Observable<boolean> {
    return this.permissionsService.canViewFeedback();
  }
}
