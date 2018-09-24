import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {AngularFireAuth} from '@angular/fire/auth';
import {map, take} from 'rxjs/operators';

@Injectable()
export class CanActivateAuthGuard implements CanActivate {

  constructor(private auth: AngularFireAuth) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.auth.authState.pipe(
      take(1),
      map(authState => !!authState));
  }
}
