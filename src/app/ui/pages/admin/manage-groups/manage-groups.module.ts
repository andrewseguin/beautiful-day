import {NgModule} from '@angular/core';
import {ManageGroupsComponent} from './manage-groups.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../../../material.module';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  declarations: [ManageGroupsComponent],
  exports: [ManageGroupsComponent],
})
export class ManageGroupsModule { }
