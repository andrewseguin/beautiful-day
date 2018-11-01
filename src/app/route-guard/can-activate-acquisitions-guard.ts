import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {Permissions} from 'app/ui/season/services/permissions';

@Injectable()
export class CanActivateAcquisitionsGuard implements CanActivate {

  constructor(private permissions: Permissions) {}

  canActivate(): Observable<boolean> {
    return this.permissions.isAcquisitions;
  }
}
