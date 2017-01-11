import {Injectable} from "@angular/core";
import {CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot} from "@angular/router";
import {FirebaseAuthState, FirebaseAuth} from "angularfire2";
import {Observable} from "rxjs";
import 'rxjs/add/operator/take';
import {UsersService} from "./service/users.service";
import {PermissionsService} from "./service/permissions.service";

@Injectable()
export class CanActivateOwnerGuard implements CanActivate {

  constructor(private auth: FirebaseAuth,
              private permissionsService: PermissionsService) {}

  canActivate(): Observable<boolean> {
    return this.permissionsService.isOwner();
  }
}
