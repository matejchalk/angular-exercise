import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

import { ReservationsService } from '../reservations.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { first, takeUntil } from 'rxjs/operators';
import { Reservation } from '../reservations';
import { Currency, CurrencyService } from '../currency.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnDestroy {
  allReservations: Reservation[];
  languages = ['English', 'Czech'];
  currencies = Object.values(Currency);
  searchForm: FormGroup;
  unsubscribe$ = new Subject<void>();

  constructor(
    private reservationsService: ReservationsService,
    private currencyService: CurrencyService,
    private fb: FormBuilder
  ) {
    this.reservationsService.reservations$
      .pipe(first())
      .subscribe(reservations => this.allReservations = reservations);
    this.searchForm = this.fb.group({ text: '' });
    this.searchForm.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(_ => {
        this.reservationsService.reservations$.next(this.filterReservations());
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.complete();
  }

  updateCurrency(currency: Currency): void {
    this.currencyService.currency$.next(currency);
  }

  filterReservations(): Reservation[] {
    const text = this.searchForm.value.text.toLowerCase();
    return this.allReservations.filter(reservation => {
      const fields = [
        reservation.listingName.name,
        reservation.listingName.location,
        ...reservation.travellers.map(traveller => traveller.name)
      ];
      return fields
        .map(field => field.toLowerCase())
        .some(field => field.includes(text));
    });
  }
}
