import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable()
export class PanelsManager {
  panels = new BehaviorSubject<string[]>([]);

  openPanel(category: string, index: number) {
    const panels = this.panels.value.slice();
    panels[index] = index ?
      `${panels[index - 1]} > ${category}` : category;
    this.panels.next(panels);
  }

  closePanel(index: number) {
    const panels = this.panels.value.slice();
    panels.splice(index, 1);
    this.panels.next(panels);
  }
}
