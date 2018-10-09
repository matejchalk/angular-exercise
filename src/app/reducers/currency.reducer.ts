import { ChangeCurrency, CurrencyAction } from '../actions/currency.action';

export enum Currency {
  IDR = 'IDR',
  USD = 'USD',
  GBP = 'GBP',
  CZK = 'CZK'
}

export interface CurrencyState {
  currency: Currency;
}

const initialState: CurrencyState = {
  currency: Currency.IDR
};

export function currencyReducer(state = initialState, action: CurrencyAction) {
  switch (action.type) {
    case ChangeCurrency.type: {
      const currency = action.currency;
      return {
        ...state,
        currency
      };
    }
    default:
      return state;
  }
}
