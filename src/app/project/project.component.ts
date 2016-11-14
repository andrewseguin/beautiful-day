import {Component, OnInit} from '@angular/core';
import {AngularFire, FirebaseObjectObservable} from "angularfire2";
import {ActivatedRoute, Params} from "@angular/router";

export interface Project {
  location: string;
  name: string;
  dropoff: Object<string>;
}

@Component({
  selector: 'project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  project: FirebaseObjectObservable<Project>;

  constructor(private af: AngularFire, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      let id = params['id']; // (+) converts string 'id' to a number
      console.log(id);
      this.project = this.af.database.object(`projects/${id}`);
    });
    //this.project = this.af.database.object
  }

  onChange(e: Event) {
    this.project.set({name: e});
    console.log(e);
  }

}
