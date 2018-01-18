import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {Item} from 'app/model/item';
import {ItemsService} from 'app/service/items.service';
import {RequestsService} from 'app/service/requests.service';

@Component({
  selector: 'import-items',
  templateUrl: './export-items.component.html',
  styleUrls: ['./export-items.component.scss']
})
export class ExportItemsComponent {
  items: Item[];
  itemRequestCount: Map<string, number>;

  constructor(private dialogRef: MatDialogRef<ExportItemsComponent>,
              private itemsService: ItemsService,
              private requestsService: RequestsService) {
    this.itemsService.items.subscribe(items => {
      this.items = items;
    });

    this.requestsService.requests.subscribe(requests => {
      this.itemRequestCount = new Map();
      requests.forEach(request => {
        let count = (this.itemRequestCount.get(request.item) || 0) + 1;
        this.itemRequestCount.set(request.item, count);
      });
    });
  }

  close() {
    this.dialogRef.close();
  }
}
