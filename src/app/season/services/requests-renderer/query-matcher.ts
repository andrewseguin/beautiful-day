import {DateQuery, InputQuery, NumberQuery} from './query';

export function stringContainsQuery(str: string, query: InputQuery) {
  if (!str) {
    return false;
  }

  const input = query.input;
  if (!input) {
    return true;
  }

  switch (query.equality) {
    case 'contains':
      return str.toLowerCase().indexOf(input.toLowerCase()) !== -1;
    case 'is':
      return str.toLowerCase() === input.toLowerCase();
    case 'notContains':
      return str.toLowerCase().indexOf(input.toLowerCase()) === -1;
    case 'notIs':
      return str.toLowerCase() !== input.toLowerCase();
  }
}

export function numberMatchesEquality(num: number, query: NumberQuery) {
  if (!query.value && query.value !== 0) {
    return true;
  }

  if (query.equality === 'greaterThan') {
    return  num > query.value;
  } else if (query.equality === 'lessThan') {
    return num < query.value;
  } else {
    return num === query.value;
  }
}

export function dateMatchesEquality(dateStr: string, query: DateQuery) {
  if (!query.date) {
    return true;
  }

  const date = new Date(dateStr);
  const queryDate = new Date(query.date);

  if (query.equality === 'after') {
    return  date > queryDate;
  } else if (query.equality === 'before') {
    return date < queryDate;
  } else {
    return date.toISOString() === queryDate.toISOString();
  }
}
