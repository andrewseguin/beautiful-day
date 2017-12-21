import {NgModule} from '@angular/core';
import {HeaderComponent} from './header.component';
import {MaterialModule} from 'app/material.module';
import {ProjectNavModule} from 'app/ui/shared/header/project-nav/project-nav.module';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    ProjectNavModule,
  ],
  declarations: [HeaderComponent],
  exports: [HeaderComponent],
})
export class HeaderModule { }
