import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {Item} from 'app/model/item';
import {ItemsDao} from 'app/ui/season/dao';

enum COLUMNS {
  ID, NAME, CATEGORIES, URL, COST, HIDDEN, KEYWORDS, QUANTITY
}

@Component({
  templateUrl: 'import-items.html',
  styleUrls: ['import-items.scss']
})
export class ImportItems {
  items: Item[];

  constructor(private dialogRef: MatDialogRef<ImportItems>,
              private itemsDao: ItemsDao) { }

  close() {
    this.dialogRef.close();
  }

  save() {
    this.items.forEach(item => {
      this.itemsDao.update(item.id, {...item});
    });
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

      let id = itemInfo[COLUMNS.ID];
      let categories = itemInfo[COLUMNS.CATEGORIES];
      let name = itemInfo[COLUMNS.NAME];
      let hidden = !!itemInfo[COLUMNS.HIDDEN];
      let url = itemInfo[COLUMNS.URL] || '';
      let cost: number = itemInfo[COLUMNS.COST] ?
          +(itemInfo[COLUMNS.COST].replace('$', '').replace(',', '')) :
          0;
      let keywords = itemInfo[COLUMNS.KEYWORDS];
      let quantityOwned = itemInfo[COLUMNS.QUANTITY];

      const item = {id, name, categories, url, cost, hidden, keywords, quantityOwned};

      // Delete optional fields to avoid undefined setting
      if (!item.hidden) {
        delete item.hidden;
      }

      if (!item.keywords) {
        delete item.keywords;
      }

      if (!item.quantityOwned) {
        delete item.quantityOwned;
      }

      return item;
    });
  }
}
