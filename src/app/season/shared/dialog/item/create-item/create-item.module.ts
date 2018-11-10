import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from 'app/material.module';
import {CreateItem} from './create-item';

@NgModule({
  imports: [
    MaterialModule,
    ReactiveFormsModule,
  ],
  declarations: [CreateItem],
  exports: [CreateItem],
  entryComponents: [CreateItem]
})
export class CreateItemModule { }
