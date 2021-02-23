import {Permissions} from 'app/season/services';
import {Directive, Input} from '@angular/core';
import {Observable} from 'rxjs';

@Directive({
  selector: '[guardEdit]',
  host: {
    // TODO: Fix this, it broke with Ivy
    // '[style.pointer-events]': `(canAccess | async) ? '' : 'none'`,
  },
})
export class GuardEdit {
  @Input('guardEdit') type: string;

  canAccess: Observable<boolean>;

  constructor (private permissions: Permissions) {}

  ngOnInit() {
    this.canAccess = this.permissions.editableRequestProperties[this.type];
  }
}
