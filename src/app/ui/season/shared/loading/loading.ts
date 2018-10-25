import {Component, Input} from '@angular/core';

@Component({
  selector: 'loading',
  templateUrl: './loading.html',
  styleUrls: ['./loading.scss'],
})
export class Loading {
  @Input() label: string;
}
