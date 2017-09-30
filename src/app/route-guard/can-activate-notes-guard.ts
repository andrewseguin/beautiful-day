import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/take';
import {PermissionsService} from '../service/permissions.service';

@Injectable()
export class CanActivateNotesGuard implements CanActivate {

  constructor(private permissionsService: PermissionsService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const projectId = route.parent.params['id'];
    return this.permissionsService.getEditPermissions(projectId)
        .map(editPermissions => editPermissions.notes);
  }
}
