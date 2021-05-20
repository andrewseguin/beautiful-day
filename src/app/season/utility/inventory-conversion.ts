import { Item } from '../dao';

interface Column {
  title: string;
  dataAccessor: (item: Item) => string;
  setItemProperty: (data: string, item: Item) => void;
}

const columns: Column[] = [
  {
    title: 'ID',
    dataAccessor: (item: Item) => item.id,
    setItemProperty: (data: string, item: Item) => (item.id = data),
  },
  {
    title: 'Name',
    dataAccessor: (item: Item) => item.name,
    setItemProperty: (data: string, item: Item) => (item.name = data),
  },
  {
    title: 'Categories',
    dataAccessor: (item: Item) => item.categories.join(','),
    setItemProperty: (data: string, item: Item) =>
      (item.categories = (data || '').split(',')),
  },
  {
    title: 'Url',
    dataAccessor: (item: Item) => item.url,
    setItemProperty: (data: string, item: Item) => (item.url = data),
  },
  {
    title: 'Cost',
    dataAccessor: (item: Item) => String(item.cost),
    setItemProperty: (data: string, item: Item) =>
      (item.cost = data ? +data.replace('$', '').replace(',', '') : 0),
  },
  {
    title: 'Hidden',
    dataAccessor: (item: Item) => String(!!item.hidden),
    setItemProperty: (data: string, item: Item) =>
      (item.hidden = data.toLowerCase() === 'true'),
  },
  {
    title: 'Keywords',
    dataAccessor: (item: Item) => item.keywords || '',
    setItemProperty: (data: string, item: Item) => (item.keywords = data),
  },
  {
    title: 'Quantity',
    dataAccessor: (item: Item) => String(item.quantityOwned || 0),
    setItemProperty: (data: string, item: Item) => (item.quantityOwned = +data),
  },
  {
    title: 'Date Created',
    dataAccessor: (item: Item) => item.dateCreated,
    setItemProperty: (data: string, item: Item) => (item.dateCreated = data),
  },
];

export function getItemsAsTsv(items: Item[]): string {
  let fileData = '';

  let headerRow = '';
  for (const column of columns) {
    headerRow += column.title + '\t';
  }
  fileData += headerRow + '\n';

  for (const item of items) {
    let itemRow = '';
    for (const column of columns) {
      itemRow += column.dataAccessor(item) + '\t';
    }
    fileData += itemRow + '\n';
  }

  return fileData;
}

export function importItemsFromTsv(tsvData: string): Item[] {
  const itemRows = tsvData.trim().split('\n');

  const headerRow = itemRows.shift();
  const error = areColumnsInvalid(headerRow.split('\t'));
  if (error) {
    throw Error(error);
  }

  return itemRows.map((itemRow) => {
    const itemInfo = itemRow.split('\t');

    const item: Item = {};
    for (let i = 0; i < columns.length; i++) {
      columns[i].setItemProperty(itemInfo[i], item);
    }

    return item;
  });
}

function areColumnsInvalid(row: string[]): string | null {
  let error = null;
  for (let i = 0; i < columns.length; i++) {
    const actual = row[i];
    if (actual.trim().toLowerCase() !== columns[i].title.toLowerCase()) {
      error = `Column was "${actual}" but expected "${columns[i].title}"`;
      break;
    }
  }

  return error;
}
