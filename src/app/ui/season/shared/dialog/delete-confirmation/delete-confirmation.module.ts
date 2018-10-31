import {NgModule} from '@angular/core';
import {MaterialModule} from 'app/material.module';
import {DeleteConfirmation} from 'app/ui/season/shared/dialog/delete-confirmation/delete-confirmation';

@NgModule({
  imports: [
    MaterialModule,
  ],
  declarations: [DeleteConfirmation],
  exports: [DeleteConfirmation],
  entryComponents: [DeleteConfirmation]
})
export class DeleteConfirmationModule { }

