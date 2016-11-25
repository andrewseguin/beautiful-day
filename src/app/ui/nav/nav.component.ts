import {Component, OnInit, Input} from '@angular/core';
import {FirebaseListObservable} from "angularfire2";
import {MdSidenav} from "@angular/material";

import {ProjectsService} from '../../service/projects.service';

@Component({
  selector: 'nav-content',
  templateUrl: 'nav.component.html',
  styleUrls: ['nav.component.css']
})
export class NavComponent implements OnInit {
  projects: FirebaseListObservable<any[]>;

  constructor(private projectsService: ProjectsService) { }

  @Input() sidenav: MdSidenav;

  ngOnInit() {
    this.projects = this.projectsService.getProjects();
  }
}
