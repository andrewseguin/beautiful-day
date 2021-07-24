import {ChangeDetectionStrategy, Component, ElementRef, ViewChild} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {ActivatedSeason, Header, Permissions} from './services';
import {filter, map, switchMap, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {SeasonsDao} from 'app/service/seasons-dao';

@Component({
  templateUrl: 'season.html',
  styleUrls: ['season.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Season {
  season = this.activatedSeason.season;

  seasonExists = this.season.pipe(
    filter(d => !!d),
    switchMap(season => this.seasonsDao.get(season)),
    map(d => !!d));

  @ViewChild('routerContent', { static: false }) routerContent: ElementRef;

  private destroyed = new Subject();

  constructor(private router: Router,
              private header: Header,
              private permissions: Permissions,
              private activatedSeason: ActivatedSeason,
              private seasonsDao: SeasonsDao,
              private activatedRoute: ActivatedRoute) {
    this.seasonExists.pipe(takeUntil(this.destroyed))
      .subscribe(seasonExists => {
        if (!seasonExists) {
          this.router.navigate(['/']);
        }
      });

    this.activatedRoute.params.pipe(takeUntil(this.destroyed)).subscribe(params => {
      this.activatedSeason.season.next(params['season']);
    });
    this.router.events.pipe(takeUntil(this.destroyed)).subscribe(event => {
      if (event instanceof NavigationEnd && this.routerContent) {
        // When the router changes, scroll back to the top of the router content div
        this.routerContent.nativeElement.scrollTop = 0;
      }
    });

  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
