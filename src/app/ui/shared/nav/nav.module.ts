import {NgModule} from '@angular/core';
import {NavComponent} from 'app/ui/shared/nav/nav.component';
import {MaterialModule} from 'app/material.module';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
  ],
  declarations: [NavComponent],
  exports: [NavComponent],
})
export class NavModule { }
