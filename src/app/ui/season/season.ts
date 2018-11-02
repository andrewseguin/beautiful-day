import {Component, ElementRef, ViewChild} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {ActivatedSeason, Header, Permissions} from './services';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  templateUrl: 'season.html',
  styleUrls: ['season.scss'],
})
export class Season {
  season: number;

  @ViewChild('routerContent') routerContent: ElementRef;

  private destroyed = new Subject();

  constructor(private router: Router,
              private header: Header,
              private permissions: Permissions,
              private activatedSeason: ActivatedSeason,
              private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.pipe(takeUntil(this.destroyed)).subscribe(params => {
      this.season = +params['season'];
      this.activatedSeason.season.next(params['season']);
    });
    this.router.events.pipe(takeUntil(this.destroyed)).subscribe(event => {
      if (event instanceof NavigationEnd) {
        // When the router changes, scroll back to the top of the router content div
        this.routerContent.nativeElement.scrollTop = 0;
      }
    });

    this.permissions.init();
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
