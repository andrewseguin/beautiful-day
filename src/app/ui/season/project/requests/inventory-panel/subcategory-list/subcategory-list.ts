import {Component, Input} from '@angular/core';
import {PanelsManager} from '../panels-manager';

@Component({
  selector: 'subcategory-list',
  templateUrl: 'subcategory-list.html',
  styleUrls: ['subcategory-list.scss']
})
export class SubcategoryList {
  @Input() subcategories: string[];

  constructor(public panelsManager: PanelsManager) {}
}
