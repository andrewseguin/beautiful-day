import {ChangeDetectionStrategy, Component, ElementRef, ViewChild} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {ActivatedSeason, Header, Permissions} from './services';
import {map, takeUntil} from 'rxjs/operators';
import {combineLatest, Subject} from 'rxjs';
import {SeasonsDao} from 'app/service/seasons-dao';

@Component({
  templateUrl: 'season.html',
  styleUrls: ['season.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(keydown)': 'onKeyDown($event)'
  }
})
export class Season {
  season: number;

  @ViewChild('routerContent') routerContent: ElementRef;

  seasonExists = combineLatest([this.seasonsDao.map, this.activatedRoute.params])
    .pipe(map(result => {
      const seasonsMap = result[0];
      const params = result[1];
      return seasonsMap && seasonsMap.has(params['season']);
    }));

  private destroyed = new Subject();

  constructor(private router: Router,
              private header: Header,
              private permissions: Permissions,
              private activatedSeason: ActivatedSeason,
              private seasonsDao: SeasonsDao,
              private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.pipe(takeUntil(this.destroyed)).subscribe(params => {
      this.season = +params['season'];
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

  onKeyDown(e: Event) {
    console.log(e);
  }
}
