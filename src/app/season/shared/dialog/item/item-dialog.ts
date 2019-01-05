import {Injectable} from '@angular/core';
import {map, mergeMap, take, takeUntil} from 'rxjs/operators';
import {MatDialog, MatDialogConfig, MatSnackBar, MatSnackBarConfig} from '@angular/material';
import {Item, ItemsDao, ProjectsDao, RequestsDao} from 'app/season/dao';
import {CreateItem, CreateItemResult} from './create-item/create-item';
import {combineLatest, of, Subject} from 'rxjs';
import {highlight} from 'app/utility/element-actions';
import {createRequest} from 'app/season/utility/create-request';
import {
  PromptDialog,
  PromptDialogResult
} from 'app/season/shared/dialog/prompt-dialog/prompt-dialog';
import {Selection} from 'app/season/services';
import {getMergedObjectValue} from 'app/season/utility/merged-obj-value';
import {
  EditItemStatus,
  EditStatusData
} from 'app/season/shared/dialog/item/edit-item-status/edit-item-status';
import {
  DeleteConfirmation,
  DeleteConfirmationData
} from 'app/season/shared/dialog/delete-confirmation/delete-confirmation';
import {ImportFromFile} from 'app/season/shared/dialog/item/import-from-file/import-from-file';

@Injectable()
export class ItemDialog {
  categories = [];

  destroyed = new Subject();

  constructor(private dialog: MatDialog,
              private selection: Selection,
              private requestsDao: RequestsDao,
              private projectsDao: ProjectsDao,
              private snackBar: MatSnackBar,
              private itemsDao: ItemsDao) {
    this.itemsDao.list.pipe(takeUntil(this.destroyed)).subscribe(items => {
      if (!items) {
        return;
      }

      const categories = new Set();
      items.forEach(item => {
        item.categories.forEach(c => {
          if (!c.includes('>')) {
            categories.add(c);
          }
        });
      });

      this.categories = Array.from(categories);
    });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  createItem(category: string, project?: string) {
    const data = {
      category,
      categories: this.categories,
      showRequest: !!project
    };

    this.dialog.open(CreateItem, {data, width: '400px'}).afterClosed().pipe(
      take(1))
      .subscribe((result: CreateItemResult) => {
        if (result) {
          this.itemsDao.add(result.item).then(item => {
            if (result.addRequest) {
              this.makeRequest(project, item);
            }
          });
        }
      });
  }

  editName(ids: string[]) {
    const items = combineLatest(ids.map(id => this.itemsDao.get(id)));
    this.openPromptDialog(ids, 'name', {
      width: '300px',
      data: {
        title: 'Edit Name',
        input: getMergedObjectValue(items, 'name')
      }
    });
  }

  editCategories(ids: string[]) {
    const categories = combineLatest(ids.map(id => this.itemsDao.get(id)))
        .pipe(map(items => {
          const first = items[0].categories.sort().join(', ');
          const allMatching = items.every(i => i.categories.sort().join(', ') === first);
          return allMatching ? first : '';
        }));

    const config = {
      width: '390px',
      data: {
        title: 'Edit Categories',
        input: categories,
        useTextArea: true,
        description: `
          Separate each category with a comma. Use '>' to create subcategories. For example,
          "Construction > Gloves, Landscaping > Gloves".
        `
      }
    };

    const dialogRef = this.dialog.open(PromptDialog, config);
    dialogRef.afterClosed().pipe(take(1)).subscribe((result: PromptDialogResult) => {
      if (result) {
        const update = {};
        const categoriesStr = result.value as string;
        update['categories'] = categoriesStr.split(',').map(v => v.trim());
        this.itemsDao.update(ids, update);
        this.selection.items.clear();
      }
    });
  }

  editCost(ids: string[]) {
    const items = combineLatest(ids.map(id => this.itemsDao.get(id)));
    this.openPromptDialog(ids, 'cost', {
      width: '300px',
      data: {
        title: 'Edit Cost',
        type: 'number',
        input: getMergedObjectValue(items, 'cost')
      }
    });
  }

  editStock(ids: string[]) {
    const items = combineLatest(ids.map(id => this.itemsDao.get(id)));
    this.openPromptDialog(ids, 'quantityOwned', {
      width: '300px',
      data: {
        title: 'Edit Stock',
        type: 'number',
        input: getMergedObjectValue(items, 'quantityOwned')
      }
    });
  }

  editApproved(ids: string[]) {
    const config: MatDialogConfig<EditStatusData> = {
      width: '300px',
      data: {
        label: 'Approved',
        value: combineLatest(ids.map(id => this.itemsDao.get(id))).pipe(
          map(items => items.every(i => i.isApproved)))
      }
    };

    const dialogRef = this.dialog.open(EditItemStatus, config);
    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      if (result) {
        const update = {isApproved: result.value};
        this.itemsDao.update(ids, update);
        this.selection.items.clear();
      }
    });
  }

  editHidden(ids: string[]) {
    const config: MatDialogConfig<EditStatusData> = {
      width: '300px',
      data: {
        label: 'Hidden',
        value: combineLatest(ids.map(id => this.itemsDao.get(id))).pipe(
          map(items => items.every(i => i.hidden)))
      }
    };

    const dialogRef = this.dialog.open(EditItemStatus, config);
    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      if (result) {
        const update = {hidden: result.value};
        this.itemsDao.update(ids, update);
        this.selection.items.clear();
      }
    });
  }

  editUrl(ids: string[]) {
    const items = combineLatest(ids.map(id => this.itemsDao.get(id)));
    this.openPromptDialog(ids, 'url', {
      width: '400px',
      data: {
        title: 'Edit URL',
        useTextArea: true,
        input: getMergedObjectValue(items, 'url')
      }
    });
  }

  deleteItems(ids: string[]) {
    const name = ids.length > 1 ?
        of('these items') :
        this.itemsDao.get(ids[0]).pipe(map(i => `${i.name}`));
    const warning = this.requestsDao.list.pipe(map(requests => {
      if (requests) {
        const numRequests = requests.filter(r => ids.indexOf(r.item) !== -1).length;
        if (numRequests) {
          return `This will also delete ${numRequests} ${numRequests > 1 ? 'requests' : 'request'}`;
        }
      }
    }));
    const config = {data: {name, warning}};
    const dialogRef = this.dialog
      .open<DeleteConfirmation, DeleteConfirmationData, boolean>(DeleteConfirmation, config);
    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      if (!result) {
        return;
      }

      const itemsStream = combineLatest(ids.map(id => this.itemsDao.get(id)));
      const requestsStream = this.requestsDao.list.pipe(map(requests => {
        if (requests) {
          return requests.filter(r => ids.indexOf(r.item) !== -1);
        }
      }));

      combineLatest([itemsStream, requestsStream]).pipe(take(1)).subscribe(result => {
        const items = result[0];
        const requests = result[1];


        this.itemsDao.remove(items.map(i => i.id));
        this.requestsDao.remove(requests.map(r => r.id));

        const message = `Removed ${ids.length > 1 ? 'items' : 'item'}`;
        const config: MatSnackBarConfig = {duration: 5000};
        this.snackBar.open(message, 'Undo', config).onAction().subscribe(() => {
          this.itemsDao.add(items);
          this.requestsDao.add(requests);
        });

        this.selection.items.clear();
      });
    });
  }

  importItemsFromFile() {
    this.dialog.open(ImportFromFile).afterClosed().pipe(take(1))
        .subscribe((items: Item[]) => {
          if (items) {
            this.itemsDao.add(items);
            this.snackBar.open(`Imported ${items.length} items`, null, {duration: 2000});
          }
        });
  }

  importItemsFromSeason() {

  }

  private makeRequest(project: string, item: string) {
    this.projectsDao.get(project).pipe(take(1)).subscribe(project => {
      const request = createRequest(project, item, 1);
      this.requestsDao.add(request).then(id => {
        highlight(id);
      });
    });
  }

  private openPromptDialog(ids: string[], property: string, config: MatDialogConfig) {
    const dialogRef = this.dialog.open(PromptDialog, config);
    dialogRef.afterClosed().pipe(take(1)).subscribe((result: PromptDialogResult) => {
      if (result) {
        const update = {};
        update[property] = result.value;
        this.itemsDao.update(ids, update);
        this.selection.items.clear();
      }
    });
  }
}
