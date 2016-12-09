import {
  Component, OnInit, Input, ElementRef, ViewChild,
  trigger, animate, transition, style, state
} from '@angular/core';
import {ItemsService} from "../../../../service/items.service";
import {Request} from "../../../../model/request";
import {ActivatedRoute, Params} from "@angular/router";
import {CategoriesService} from "../../../../service/categories.service";
import {RequestsService} from "../../../../service/requests.service";
import {MdDialog} from "@angular/material";
import {EditNoteComponent} from "../../../dialog/edit-note/edit-note.component";
import {EditDropoffComponent} from "../../../dialog/edit-dropoff/edit-dropoff.component";

@Component({
  selector: 'request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss'],
  animations: [
    trigger('state', [
      state('normal', style({background: 'transparent'})),
      state('highlight', style({background: 'rgba(255,235,59,.2)'})),
      transition('highlight => normal', [
        animate('1350ms cubic-bezier(0.35, 0, 0.25, 1)')]
      ),
      transition('normal => highlight', [
        animate('250ms cubic-bezier(0.35, 0, 0.25, 1)')]
      ),
    ])
  ]
})
export class RequestComponent implements OnInit {
  category: string;
  item: string;
  projectId: string;
  state: string = 'normal';

  @Input() request: Request;
  @ViewChild('quantityInput') quantityInput: ElementRef;

  constructor(private route: ActivatedRoute,
              private mdDialog: MdDialog,
              private elementRef: ElementRef,
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

  getRequestKey(): string {
    return this.request.$key;
  }

  scrollIntoView(): void {
    this.elementRef.nativeElement.scrollIntoView(false);
    this.highlight();
  }

  highlight(): void {
    this.state = 'highlight';
    setTimeout(() => {
      this.state = 'normal';
      console.log('Moving state to normal')
    }, 1000);
  }

  changeQuantity(quantity: number) {
    this.requestsService.update(this.request.$key, {quantity});
  }

  isSelected() {
    return this.requestsService.isSelected(this.request.$key);
  }

  setSelected(value: boolean) {
    this.requestsService.setSelected(this.request.$key, value);
  }

  editNote(e: Event) {
    e.stopPropagation();

    const dialogRef = this.mdDialog.open(EditNoteComponent);
    dialogRef.componentInstance.requestIds = new Set([this.request.$key]);
    dialogRef.componentInstance.note = this.request.note;
  }

  editDropoff(e: Event) {
    e.stopPropagation();

    const dialogRef = this.mdDialog.open(EditDropoffComponent);
    dialogRef.componentInstance.requestIds = new Set([this.request.$key]);
    dialogRef.componentInstance.selectedDropoffLocation = this.request.dropoff;
    dialogRef.componentInstance.setDateFromRequest(this.request.date);
    dialogRef.componentInstance.project = this.projectId;
  }
}
