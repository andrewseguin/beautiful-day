import {Component, ElementRef, ViewChild} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent {
  @ViewChild('routerContent') routerContent: ElementRef;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // When the router changes, scroll back to the top of the router content div
        this.routerContent.nativeElement.scrollTop = 0;
      }
    });
  }
}
