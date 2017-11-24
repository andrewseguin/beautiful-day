import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Item} from '../../../../../../model/item';
import {EditItemComponent} from '../../../../../shared/dialog/edit-item/edit-item.component';
import {MatDialog} from '@angular/material';
import {ItemsService} from '../../../../../../service/items.service';
import {ItemSearchPipe} from '../../../../../../pipe/item-search.pipe';
import {PanelsService} from '../panels.service';

@Component({
  selector: 'subcategory-list',
  templateUrl: './subcategory-list.component.html',
  styleUrls: ['./subcategory-list.component.scss']
})
export class SubcategoryListComponent {
  @Input() subcategories: string[];

  constructor(public panelsService: PanelsService) {}
}
