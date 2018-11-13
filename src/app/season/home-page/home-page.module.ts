import {NgModule} from '@angular/core';
import {HomePage} from './home-page';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [{path: '', component: HomePage}];

@NgModule({imports: [RouterModule.forChild(routes)], exports: [RouterModule]})
export class HomePageRoutingModule {}

@NgModule({
  imports: [HomePageRoutingModule],
  declarations: [HomePage],
  exports: [HomePage],
})
export class HomePageModule { }
