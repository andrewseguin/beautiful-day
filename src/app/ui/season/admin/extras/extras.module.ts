import {NgModule} from '@angular/core';
import {ExtrasComponent} from './extras.component';
import {AngularFireDatabaseModule} from '@angular/fire/database';

@NgModule({
  imports: [AngularFireDatabaseModule],
  declarations: [ExtrasComponent],
  exports: [ExtrasComponent],
})
export class ExtrasModule { }
