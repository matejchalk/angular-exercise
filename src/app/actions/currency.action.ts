import { Action } from '@ngrx/store';
import { Currency } from '../reducers/currency.reducer';

export class ChangeCurrency implements Action {
  static readonly type: 'Change Currency' = 'Change Currency';
  readonly type = ChangeCurrency.type;
  constructor(public currency: Currency) {}
}

export type CurrencyAction = ChangeCurrency;
