import {Directive, Input} from '@angular/core';
import {Permissions} from 'app/season/services';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';

@Directive({selector: 'route-guard'})
export class RouteGuard {
  private destroyed = new Subject();

  @Input() check: 'acquisitions' | 'admin';

  constructor(private permissions: Permissions, private router: Router) {}

  ngOnInit() {
    switch (this.check) {
      case 'acquisitions':
        this.permissions.isAcquisitions.subscribe(value => {
          if (value !== null && !value) {
            this.router.navigate(['']);
          }
        });
        break;
      case 'admin':
        this.permissions.isAdmin.subscribe(value => {
          if (value !== null && !value) {
            this.router.navigate(['']);
          }
        });
    }
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
