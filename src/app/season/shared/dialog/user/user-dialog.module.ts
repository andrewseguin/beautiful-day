import {NgModule} from '@angular/core';
import {UserDialog} from './user-dialog';
import {EditUserProfileModule} from './edit-user-profile/edit-user-profile.module';

@NgModule({
  imports: [EditUserProfileModule],
  providers: [UserDialog]
})
export class UserDialogModule { }
