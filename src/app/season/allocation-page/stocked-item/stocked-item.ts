import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {EXPANSION_ANIMATION} from 'app/utility/animations';


@Component({
  selector: 'stocked-item',
  templateUrl: 'stocked-item.html',
  styleUrls: ['stocked-item.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: EXPANSION_ANIMATION,
})
export class StockedItem {
  @Input() itemName: string;
  @Input() quantityOwned: number;
  @Input() remaining: number;

  expanded = false;
}
