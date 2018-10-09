import { createSelector } from '@ngrx/store';

import { State } from '../reducers';
import { Currency } from '../reducers/currency.reducer';

export const $currency = (state: State) => state.currency.currency;

export const $currencies = () => Object.values(Currency);

export const $currencyRate = createSelector(
  $currency,
  currency => {
    switch (currency) {
      case Currency.IDR:
        return 1;
      case Currency.USD:
        return 0.000067;
      case Currency.GBP:
        return 0.000051;
      case Currency.CZK:
        return 0.0015;
    }
  }
);
