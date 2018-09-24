import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {PermissionsService} from 'app/service/permissions.service';
import {map} from 'rxjs/operators';

@Injectable()
export class CanActivateNotesGuard implements CanActivate {

  constructor(private permissionsService: PermissionsService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const projectId = route.parent.params['id'];
    return this.permissionsService.getEditPermissions(projectId)
        .pipe(map(editPermissions => editPermissions.notes));
  }
}
