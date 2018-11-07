import {NgModule} from '@angular/core';
import {HelpPage} from './help-page';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [{path: '', component: HelpPage}];

@NgModule({imports: [RouterModule.forChild(routes)], exports: [RouterModule]})
export class HelpPageRoutingModule {}

@NgModule({
  imports: [HelpPageRoutingModule],
  declarations: [HelpPage],
  exports: [HelpPage],
})
export class HelpPageModule { }
