import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from 'app/material.module';
import {EditableProjectComponent} from 'app/ui/pages/admin/manage-projects/editable-project/editable-project.component';
import {ReactiveFormsModule} from '@angular/forms';
import {EditableChipListModule} from 'app/ui/pages/admin/editable-chip-list/editable-chip-list.module';

@NgModule({
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, EditableChipListModule],
  declarations: [EditableProjectComponent],
  exports: [EditableProjectComponent],
})
export class EditableProjectModule { }
