import {NgModule} from '@angular/core';
import {Extras} from './extras';
import {AngularFireDatabaseModule} from '@angular/fire/database';

@NgModule({
  imports: [AngularFireDatabaseModule],
  declarations: [Extras],
  exports: [Extras],
})
export class ExtrasModule { }
