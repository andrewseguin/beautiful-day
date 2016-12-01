import {Component, OnInit, Input, ViewEncapsulation, ElementRef, ViewChild} from '@angular/core';
import {ItemsService} from "../../../../service/items.service";
import {Request} from "../../../../model/request";
import {ActivatedRoute, Params} from "@angular/router";
import {ProjectsService} from "../../../../service/projects.service";
import {CategoriesService} from "../../../../service/categories.service";
import {RequestsService} from "../../../../service/requests.service";
import {MdDialog} from "@angular/material";
import {EditNoteComponent} from "../../../dialog/edit-note/edit-note.component";
import {EditDropoffComponent} from "../../../dialog/edit-dropoff/edit-dropoff.component";
import {Dropoff} from "../../../../model/dropoff";
import {MediaQueryService} from "../../../../service/media-query.service";

@Component({
  selector: 'request',
  templateUrl: 'request.component.html',
  styleUrls: ['request.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RequestComponent implements OnInit {
  category: string;
  item: string;
  projectId: string;

  @Input() request: Request;
  @ViewChild('quantityInput') quantityInput: ElementRef;

  constructor(private route: ActivatedRoute,
              private mdDialog: MdDialog,
              private mediaQuery: MediaQueryService,
              private categoryService: CategoriesService,
              private requestsService: RequestsService,
              private itemsService: ItemsService) { }

  ngOnInit() {
    this.itemsService.getItem(this.request.item).subscribe(item => {
      this.item = item.name;
      this.categoryService.getCategory(item.category).subscribe(category => {
        this.category = category.name;
      });
    });

    this.route.parent.params.forEach((params: Params) => {
      this.projectId = params['id'];
    });
  }

  changeQuantity(quantity: number) {
    this.requestsService.update(this.request.$key, {quantity});
    console.log(this.quantityInput)
  }

  isSelected() {
    return this.requestsService.isSelected(this.request.$key);
  }

  setSelected(value: boolean) {
    this.requestsService.setSelected(this.request.$key, value);
  }

  editNote(e: Event) {
    // If mobile, use selection header
    if (this.mediaQuery.isMobile()) { return; }

    e.stopPropagation();

    const dialogRef = this.mdDialog.open(EditNoteComponent);
    dialogRef.componentInstance.requestIds = new Set([this.request.$key]);
    dialogRef.componentInstance.note = this.request.note;
  }

  editDropoff(e: Event) {
    // If mobile, use selection header
    if (this.mediaQuery.isMobile()) { return; }

    e.stopPropagation();

    const dialogRef = this.mdDialog.open(EditDropoffComponent);
    dialogRef.componentInstance.requestIds = new Set([this.request.$key]);
    dialogRef.componentInstance.selectedDropoffLocation = this.request.dropoff;
    dialogRef.componentInstance.dateNeeded =
      this.getDateInputFormat(new Date(this.request.date));
    dialogRef.componentInstance.project = this.projectId;
  }

  getDateInputFormat(d: Date) {
    const day = ("0" + d.getDate()).slice(-2);
    const month = ("0" + (d.getMonth() + 1)).slice(-2);
    return d.getFullYear()+"-"+(month)+"-"+(day) ;
  }
}
