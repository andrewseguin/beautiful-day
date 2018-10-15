import {Component, Input} from '@angular/core';
import {MatDialog, MatSidenav} from '@angular/material';
import {Router} from '@angular/router';
import {PermissionsService} from 'app/service/permissions.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {AngularFireAuth} from '@angular/fire/auth';
import {AuthService} from 'app/service/auth-service';
import {EditUserProfileComponent} from '../dialog/edit-user-profile/edit-user-profile.component';

const ANIMATION_DURATION = '250ms cubic-bezier(0.35, 0, 0.25, 1)';

@Component({
  selector: 'nav-content',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  animations: [
    trigger('userSection', [
      state('void, true', style({ height: '*' })),
      state('false',   style({ height: '64px' })),
      transition('* => *', animate(ANIMATION_DURATION)),
    ]),
    trigger('arrow', [
      state('void, true',   style({ transform: 'rotate(0deg)' })),
      state('false',   style({ transform: 'rotate(180deg)' })),
      transition('* => *', animate(ANIMATION_DURATION)),
    ])
  ]
})
export class NavComponent {
  isUserProfileExpanded = false;

  constructor(public permissionsService: PermissionsService,
              public authService: AuthService,
              public afAuth: AngularFireAuth,
              public mdDialog: MatDialog,
              public router: Router) { }

  @Input() sidenav: MatSidenav;

  nagivateToHome() {
    this.router.navigate(['/projects']);
    this.sidenav.close();
  }

  editProfile(): void {
    this.mdDialog.open(EditUserProfileComponent);
  }
}
