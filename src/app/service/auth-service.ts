import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material';
import {AngularFireAuth} from 'angularfire2/auth';
import {User} from 'app/model/user';
import {Observable} from 'rxjs/Observable';
import {UsersService} from 'app/service/users.service';
import {from} from 'rxjs/observable/from';
import {mergeMap} from 'rxjs/operators';

@Injectable()
export class AuthService {
  user: Observable<User> = this.auth.authState
      .pipe(mergeMap(auth => auth ? this.usersService.getByEmail(auth.email) : from([null])));

  constructor(private snackBar: MatSnackBar,
              private router: Router,
              private usersService: UsersService,
              private auth: AngularFireAuth) {}

  /**
   * Watches the auth state of the application and redirects to the login page if
   * the user is not logged in.
   */
  watchState() {
    this.auth.authState.subscribe(auth => {
      if (!auth) {
        this.navigateToLogin();
        return;
      }

      this.usersService.addUserData(auth);
      this.notifyLoggedInAs(auth.email);
    });
  }

  /** Send user to the login page and send current location for when they are logged in. */
  private navigateToLogin() {
    // Store current location so that they redirect back here after logged in.
    let redirect = '';
    if (location.pathname !== '/login') {
      redirect = location.pathname;
    }

    this.router.navigate(['login'], {fragment: redirect});
  }

  /** Show snackbar showing the user who they are logged in as. */
  private notifyLoggedInAs(email: string) {
    const snackbarConfig = new MatSnackBarConfig();
    snackbarConfig.duration = 2000;
    this.snackBar.open(`Logged in as ${email}`, null, snackbarConfig);
  }
}
