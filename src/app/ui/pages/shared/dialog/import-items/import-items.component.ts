import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {Item} from 'app/model/item';
import {ItemsService} from 'app/service/items.service';
import {RequestsService} from 'app/service/requests.service';

enum COLUMNS {
  $KEY, NAME, CATEGORIES, URL, KEYWORDS, COST, QUANTITY_OWNED
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

      itemInfo[3] = itemInfo[3].replace('$', '');

      let item: Item = {
        name: itemInfo[0],
        categories: itemInfo[2],
        url: itemInfo[4],
        keywords: itemInfo[6]
      };

      if (itemInfo[3]) {
        item.cost = +itemInfo[3];
      }

      if (itemInfo[5]) {
        item.quantityOwned = itemInfo[5];
      }

      return item;
    });
  }
}
