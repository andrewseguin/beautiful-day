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
  templateUrl: './export-items.component.html',
  styleUrls: ['./export-items.component.scss']
})
export class ExportItemsComponent {
  items: Item[];

  constructor(private dialogRef: MatDialogRef<ExportItemsComponent>,
              private itemsService: ItemsService) {
    this.itemsService.items.subscribe(items => {
      this.items = items;
    })
  }

  close() {
    this.dialogRef.close();
  }

  getItemStr(item: Item) {
    return [
      item.$key,
      item.name,
    ].join(',');
  }
}
