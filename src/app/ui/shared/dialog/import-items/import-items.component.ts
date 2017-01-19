import {Component} from "@angular/core";
import {MdDialogRef} from "@angular/material";
import {User} from "../../../../model/user";
import {UsersService} from "../../../../service/users.service";
import {Item} from "../../../../model/item";
import {ItemsService} from "../../../../service/items.service";
import {RequestsService} from "../../../../service/requests.service";

@Component({
  selector: 'import-items',
  templateUrl: './import-items.component.html',
  styleUrls: ['./import-items.component.scss']
})
export class ImportItemsComponent {
  items: Item[];

  constructor(private dialogRef: MdDialogRef<ImportItemsComponent>,
              private itemsService: ItemsService,
              private requestsService: RequestsService) { }

  close() {
    this.dialogRef.close();
  }

  save() {
    this.itemsService.setAllItems(this.items);
    this.requestsService.removeAllRequests();
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

  extractItems(csvFileData: string): Item[] {
    const itemRows = csvFileData.split('\n');
    itemRows.shift(); // Take out the header row

    return itemRows.map(itemRow => {
      const itemInfo = itemRow.split(',');

      itemInfo[3] = itemInfo[3].replace('$', '');
      return {
        name: itemInfo[0],
        type: itemInfo[1],
        category: itemInfo[2],
        cost: +itemInfo[3],
        url: itemInfo[4],
      };
    });
  }
}
