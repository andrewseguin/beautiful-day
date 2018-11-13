import {NgModule} from '@angular/core';
import {Owner} from './owner';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {MaterialModule} from 'app/material.module';

@NgModule({
  imports: [AngularFireDatabaseModule, MaterialModule],
  declarations: [Owner],
  exports: [Owner],
})
export class OwnerModule { }
