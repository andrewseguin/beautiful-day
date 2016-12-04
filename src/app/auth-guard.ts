import {Injectable} from "@angular/core";
import {CanActivate} from "@angular/router";
import {FirebaseAuthState, FirebaseAuth} from "angularfire2";
import {Observable} from "rxjs";
import 'rxjs/add/operator/take';

@Injectable()
export class CanActivateViaAuthGuard implements CanActivate {

  constructor(private auth: FirebaseAuth) {}

  canActivate(): Observable<boolean> {
    return this.auth
      .take(1)
      .map((authState: FirebaseAuthState) => !!authState)
  }
}
