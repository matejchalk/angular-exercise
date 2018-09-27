import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export enum Currency {
  IDR = 'IDR',
  USD = 'USD',
  GBP = 'GBP',
  CZK = 'CZK'
}

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  currencies = Object.values(Currency);
  currency$ = new BehaviorSubject<Currency>(Currency.IDR);

  convert(priceInIDR: number, currency: Currency): number {
    switch (currency) {
      case Currency.IDR:
        return priceInIDR;
      case Currency.USD:
        return priceInIDR * 0.000067;
      case Currency.GBP:
        return priceInIDR * 0.000051;
      case Currency.CZK:
        return priceInIDR * 0.0015;
    }
  }
}
