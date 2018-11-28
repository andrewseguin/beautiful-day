import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'category-list',
  templateUrl: 'category-list.html',
  styleUrls: ['category-list.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryList {
  @Input() categories: string[];

  @Output() open = new EventEmitter<string>();
}
