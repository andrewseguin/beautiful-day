import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from 'app/material.module';
import {CommonModule} from '@angular/common';
import {EditableGroupComponent} from './editable-group.component';

@NgModule({
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  declarations: [EditableGroupComponent],
  exports: [EditableGroupComponent],
})
export class EditableGroupModule { }
