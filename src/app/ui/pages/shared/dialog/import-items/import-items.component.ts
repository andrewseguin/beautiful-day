import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {Item} from 'app/model/item';
import {ItemsService} from 'app/service/items.service';
import {RequestsService} from 'app/service/requests.service';

enum COLUMNS {
  $KEY, CATEGORIES, NAME, HIDDEN, URL, COST, KEYWORDS, QUANTITY
}

@Component({
  selector: 'import-items',
  templateUrl: './import-items.component.html',
  styleUrls: ['./import-items.component.scss']
})
export class ImportItemsComponent {
  items: Item[];

  constructor(private dialogRef: MatDialogRef<ImportItemsComponent>,
              private itemsService: ItemsService) { }

  close() {
    this.dialogRef.close();
  }

  save() {
    this.itemsService.updateItems(this.items);
    this.close();
  }

  importFile(fileList: FileList) {
    const file = fileList[0];

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent) => {
      this.items = this.extractItems(e.target['result']);
    };
    reader.readAsText(file);
  }

  extractItems(tsvFileData: string): Item[] {
    const itemRows = tsvFileData.split('\n');
    itemRows.shift(); // Take out the header row

    return itemRows.map(itemRow => {
      const itemInfo = itemRow.split('\t');

      let $key = itemInfo[COLUMNS.$KEY];
      let categories = itemInfo[COLUMNS.CATEGORIES];
      let name = itemInfo[COLUMNS.NAME];
      let hidden = itemInfo[COLUMNS.HIDDEN];
      let url = itemInfo[COLUMNS.URL];
      let cost: number = itemInfo[COLUMNS.COST] ?
          +(itemInfo[COLUMNS.COST].replace('$', '')) :
          undefined;
      let keywords = itemInfo[COLUMNS.KEYWORDS] || undefined;
      let quantityOwned = itemInfo[COLUMNS.QUANTITY] || undefined;



      return {$key, name, categories, url, cost, keywords, quantityOwned};
    });
  }
}
