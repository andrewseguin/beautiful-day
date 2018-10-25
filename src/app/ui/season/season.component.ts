import {Component, ElementRef, ViewChild} from '@angular/core';
import {Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import {ActivatedSeason} from './services';

@Component({
  templateUrl: './season.component.html',
  styleUrls: ['./season.component.scss'],
})
export class SeasonComponent {
  season: number;

  @ViewChild('routerContent') routerContent: ElementRef;

  constructor(private router: Router,
              private activatedSeason: ActivatedSeason,
              private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe(params => {
      this.season = +params['season'];
      this.activatedSeason.season.next(params['season']);
    });
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // When the router changes, scroll back to the top of the router content div
        this.routerContent.nativeElement.scrollTop = 0;
      }
    });
  }
}
