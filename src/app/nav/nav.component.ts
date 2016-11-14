import {Component, OnInit, Input} from '@angular/core';
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {MdSidenav} from "@angular/material";

@Component({
  selector: 'nav-content',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  items: FirebaseListObservable<any[]>;
  constructor(private af: AngularFire) { }

  @Input() sidenav: MdSidenav;

  ngOnInit() {
    this.items = this.af.database.list('/projects');
  }

}
