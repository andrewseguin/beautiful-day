import {DateQuery, InputQuery, NumberQuery, State, StateQuery} from './query';
import {Request} from 'app/season/dao';

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
    default:
      throw Error(`Unknown equality: ${query.equality}`);
  }
}

export function numberMatchesEquality(num: number, query: NumberQuery) {
  if (!query.value && query.value !== 0) {
    return true;
  }

  switch (query.equality) {
    case 'greaterThan':
      return  num > query.value;
    case 'lessThan':
      return num < query.value;
    case 'equalTo':
      return num === query.value;
    default:
      throw Error(`Unknown equality: ${query.equality}`);
  }
}

export function dateMatchesEquality(dateStr: string, query: DateQuery) {
  if (!query.date) {
    return true;
  }

  if (!dateStr) {
    return false;
  }

  const date = new Date(dateStr);
  const queryDate = new Date(query.date);

  switch (query.equality) {
    case 'after':
      return  date > queryDate;
    case 'before':
      return  date < queryDate;
    case 'on':
      return date.toISOString() === queryDate.toISOString();
    default:
      throw Error(`Unknown equality: ${query.equality}`);
  }
}


export function stateMatchesEquality(request: Request, query: StateQuery) {
  if (!query.state) {
    return true;
  }

  const values = new Map<State, boolean>([
    ['approved', request.isApproved],
    ['purchased', request.isPurchased],
    ['distributed', request.isDistributed],
    ['previouslyApproved', !!request.prevApproved],
  ]);

  switch (query.equality) {
    case 'is':
      return values.get(query.state);
    case 'notIs':
      return !values.get(query.state);
    default:
      throw Error(`Unknown equality: ${query.equality}`);
  }
}
