export type InputEquality = 'contains' | 'is' | 'notContains' | 'notIs';
export type NumberEquality = 'greaterThan' | 'lessThan' | 'equalTo';
export type DateEquality = 'before' | 'after' | 'on';
export type StateEquality = 'is' | 'notIs';
export type State = 'approved' | 'purchased' | 'distributed';

export interface InputQuery {
  input: string;
  equality: InputEquality;
}

export interface NumberQuery {
  value: number;
  equality: NumberEquality;
}

export interface DateQuery {
  date: string;
  equality: DateEquality;
}

export interface StateQuery {
  state: State;
  equality: StateEquality;
}

export type Query = InputQuery | NumberQuery | DateQuery | StateQuery;
