import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from 'app/material.module';
import {EditUserProfile} from './edit-user-profile';

@NgModule({
  imports: [
    MaterialModule,
    ReactiveFormsModule,
  ],
  declarations: [EditUserProfile],
  exports: [EditUserProfile],
  entryComponents: [EditUserProfile]
})
export class EditUserProfileModule { }

