import {Injectable} from "@angular/core";
import {CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot} from "@angular/router";
import {FirebaseAuthState, FirebaseAuth} from "angularfire2";
import {Observable} from "rxjs";
import 'rxjs/add/operator/take';

@Injectable()
export class CanActivateViaAuthGuard implements CanActivate {

  constructor(private auth: FirebaseAuth) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.auth
      .take(1)
      .map((authState: FirebaseAuthState) => !!authState)
  }
}
