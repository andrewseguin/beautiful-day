import {NgModule} from '@angular/core';
import {MaterialModule} from 'app/material.module';
import {DeleteConfirmation} from './delete-confirmation';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
  ],
  declarations: [DeleteConfirmation],
  exports: [DeleteConfirmation],
  entryComponents: [DeleteConfirmation]
})
export class DeleteConfirmationModule { }

