import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MaterialModule} from 'app/material.module';
import {EditItem} from './edit-item';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    MatAutocompleteModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  declarations: [EditItem],
  exports: [EditItem],
  entryComponents: [EditItem]
})
export class EditItemModule { }

