import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {ContactsDao, Contact} from 'app/season/dao';
import {Subject} from 'rxjs';
import {debounceTime, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'editable-contact',
  styleUrls: ['editable-contact.scss'],
  templateUrl: 'editable-contact.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditableContact {
  @Input()
  set contact(contact: Contact) {
    this._contact = contact;
    this.form.get('name').setValue(contact.name, {emitEvent: false});
    this.form.get('title').setValue(contact.title, {emitEvent: false});
    this.form.get('email').setValue(contact.email, {emitEvent: false});
  }
  get contact(): Contact { return this._contact; }
  private _contact: Contact;

  form = new FormGroup({
    name: new FormControl(''),
    title: new FormControl(''),
    email: new FormControl(''),
  });

  private _destroyed = new Subject();

  constructor(public contactsDao: ContactsDao) {
    this.form.valueChanges.pipe(
        debounceTime(500),
        takeUntil(this._destroyed))
        .subscribe(() => this.update());
  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }

  update() {
    const formValues = this.form.value;

    if (!formValues.name || !formValues.email || !formValues.title) {
      return;
    }

    const update: Contact = {
      name: formValues.name,
      email: formValues.email,
      title: formValues.title
    };

    this.contactsDao.update(this.contact.id, update);
  }

  delete() {
    this.contactsDao.remove(this.contact.id);
  }
}
