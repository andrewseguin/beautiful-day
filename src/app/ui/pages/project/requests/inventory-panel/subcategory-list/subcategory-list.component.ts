import {Component, Input} from '@angular/core';
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
