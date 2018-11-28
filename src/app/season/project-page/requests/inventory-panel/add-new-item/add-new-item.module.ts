import {NgModule} from '@angular/core';
import {AddNewItem} from './add-new-item';
import {MaterialModule} from 'app/material.module';
import {ItemDialogModule} from 'app/season/shared/dialog/item/item-dialog.module';

@NgModule({
  imports: [
    MaterialModule,
    ItemDialogModule,
  ],
  declarations: [AddNewItem],
  exports: [AddNewItem],
})
export class AddNewItemModule { }
