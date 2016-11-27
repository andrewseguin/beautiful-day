import {Component, OnInit, Input} from '@angular/core';
import {FirebaseObjectObservable} from "angularfire2";
import {ItemsService} from "../../../../service/items.service";
import {Request} from "../../../../model/request";
import {ActivatedRoute, Params} from "@angular/router";
import {ProjectsService} from "../../../../service/projects.service";
import {Project} from "../../../../model/project";
import {Item} from "../../../../model/item";
import {Category} from "../../../../model/category";
import {CategoriesService} from "../../../../service/categories.service";

@Component({
  selector: 'request',
  templateUrl: 'request.component.html',
  styleUrls: ['request.component.scss'],
})
export class RequestComponent implements OnInit {
  project: FirebaseObjectObservable<Project>;
  category: FirebaseObjectObservable<Category>;
  item: FirebaseObjectObservable<Item>;

  @Input() request: Request;

  constructor(private route: ActivatedRoute,
              private projectsService: ProjectsService,
              private categoryService: CategoriesService,
              private itemsService: ItemsService) { }

  ngOnInit() {
    this.item = this.itemsService.getItem(this.request.item);
    this.item.subscribe((item: Item) => {
      this.category = this.categoryService.getCategory(item.category);
    });
    this.route.parent.params.forEach((params: Params) => {
      this.project = this.projectsService.getProject(params['id']);
    });
  }
}
