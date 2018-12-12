import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MaterialModule} from 'app/material.module';
import {HelpPage} from './help-page';
import {CommonModule} from '@angular/common';

const routes: Routes = [{path: '', component: HelpPage}];

@NgModule({imports: [RouterModule.forChild(routes)], exports: [RouterModule]})
export class HelpPageRoutingModule {}

@NgModule({
  imports: [
    CommonModule,
    HelpPageRoutingModule,
    MaterialModule
  ],
  declarations: [HelpPage],
  exports: [HelpPage],
})
export class HelpPageModule { }
