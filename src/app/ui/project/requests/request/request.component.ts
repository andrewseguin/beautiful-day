import {Component, OnInit, Input, ViewEncapsulation} from '@angular/core';
import {ItemsService} from "../../../../service/items.service";
import {Request} from "../../../../model/request";
import {ActivatedRoute, Params} from "@angular/router";
import {ProjectsService} from "../../../../service/projects.service";
import {CategoriesService} from "../../../../service/categories.service";
import {RequestsService} from "../../../../service/requests.service";

@Component({
  selector: 'request',
  templateUrl: 'request.component.html',
  styleUrls: ['request.component.scss'],
  host: {
    '[class.heading]': 'isHeading'
  },
  encapsulation: ViewEncapsulation.None,
})
export class RequestComponent implements OnInit {
  category: string;
  item: string;
  dropoff: string;

  @Input() request: Request;
  @Input() isHeading: boolean;

  constructor(private route: ActivatedRoute,
              private projectsService: ProjectsService,
              private categoryService: CategoriesService,
              private requestsService: RequestsService,
              private itemsService: ItemsService) { }

  ngOnInit() {
    if (this.isHeading) { return; }

    this.itemsService.getItem(this.request.item).subscribe(item => {
      this.item = item.name;
      this.categoryService.getCategory(item.category).subscribe(category => {
        this.category = category.name;
      });
    });

    this.route.parent.params.forEach((params: Params) => {
      this.projectsService.getDropoffLocation(params['id'], this.request.dropoff)
          .subscribe(dropoff => this.dropoff = String(dropoff.$value));
    });
  }

  removeRequest() {
    this.requestsService.removeRequest(this.request.$key);
  }

  changeQuantity(quantity: number) {
    this.requestsService.update(this.request.$key, {quantity});
  }
}
