import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {RouteGuard} from 'app/season/shared/route-guard/route-guard';

@NgModule({
  imports: [RouterModule],
  declarations: [RouteGuard],
  exports: [RouteGuard],
})
export class RouteGuardModule { }
