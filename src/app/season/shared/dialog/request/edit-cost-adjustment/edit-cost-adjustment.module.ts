import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from 'app/material.module';
import {CommonModule} from '@angular/common';
import {EditCostAdjustment} from './edit-cost-adjustment';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  declarations: [EditCostAdjustment],
  exports: [EditCostAdjustment],
  entryComponents: [EditCostAdjustment]
})
export class EditCostAdjustmentModule { }
