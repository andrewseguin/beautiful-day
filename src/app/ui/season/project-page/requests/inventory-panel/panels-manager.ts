import {Injectable} from '@angular/core';

@Injectable()
export class PanelsManager {
  panels = [];

  openPanel(category: string) {
    const nextPanelCategory = this.panels.length ?
      `${this.panels[this.panels.length - 1]}>${category}` :
      category;
    this.panels.push(nextPanelCategory);
  }

  closePanel(index: number) {
    this.panels.splice(index, 1);
  }
}
