import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { forkJoin, from, interval, Subject } from 'rxjs';
import { map, mergeMap, skip, take, takeUntil, takeWhile, toArray } from 'rxjs/operators';

import { ReservationsService } from '../reservations.service';
import { Reservation, Status } from '../reservations';
import { Currency, CurrencyService } from '../currency.service';

enum SortKey {
  TripDate = 'Trip Date',
  ListingsName = 'Listings Name',
  Nights = 'Nights',
  Guests = 'Guests',
  Price = 'Price',
  Status = 'Status'
}

enum BulkAction {
  SelectAll = 'Select All',
  ClearAll = 'Clear All',
  DeleteSelected = 'Delete Selected'
}

enum SingleAction {
  Delete = 'Delete'
}

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class ReservationsComponent implements OnDestroy {
  reservations: Reservation[] = [];
  pages: Reservation[][] = [[]];
  currentPage = 0;
  pageLimit = 7;
  filterEnabled = true;
  sortKey: SortKey;
  sortKeys = Object.values(SortKey);
  bulkActions = Object.values(BulkAction);
  singleActions = Object.values(SingleAction);
  currency: Currency;
  filters: any = null;
  form: FormGroup = this.fb.group({});
  unsubscribe$ = new Subject<void>();

  constructor(
    private reservationService: ReservationsService,
    private currencyService: CurrencyService,
    private fb: FormBuilder
  ) {
    this.updateReservations();
    this.currencyService.currency$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(currency => {
        this.currency = currency;
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.complete();
  }

  updateReservations(): void {
    this.reservationService.reservations$
      .pipe(
        takeUntil(this.unsubscribe$),
        map(this.filterReservations.bind(this)),
        map(this.sortReservations.bind(this))
      )
      .subscribe((reservations: Reservation[]) => {
        this.reservations = reservations;
        this.pagesFromReservations();
        this.form = this.fb.group(
          reservations
            .map(reservation => 'reservation' + reservation.id)
            .reduce((acc, key) => ({ ...acc, [key]: this.form.value[key] || false }), {})
        );
      });
  }

  updateFilters(filters: any): void {
    this.filters = filters;
    this.updateReservations();
  }

  toggleFilterEnabled(): void {
    this.filterEnabled = !this.filterEnabled;
    this.updateReservations();
  }

  onSortKeyChange(): void {
    this.updateReservations();
  }

  pagesFromReservations(): void {
    interval(0)
      .pipe(
        mergeMap(i => {
          return from(this.reservations)
            .pipe(
              skip(i * this.pageLimit),
              take(this.pageLimit),
              toArray()
            );
        }),
        takeWhile((arr, i) => i === 0 || arr.length > 0),
        toArray()
      )
      .subscribe(pages => {
        this.pages = pages;
        if (this.currentPage >= this.pages.length) {
          this.currentPage = 0;
        }
      });
  }

  getConvertedPrice(reservation: Reservation): number {
    return this.currencyService.convert(reservation.price, this.currency);
  }

  spansYears(reservation: Reservation): boolean {
    return reservation.tripDate.checkInDate.getFullYear() !== reservation.tripDate.checkOutDate.getFullYear();
  }

  spansMonths(reservation: Reservation): boolean {
    return reservation.tripDate.checkInDate.getMonth() !== reservation.tripDate.checkOutDate.getMonth();
  }

  previousPageAvailable(): boolean {
    return this.currentPage > 0;
  }

  nextPageAvailable(): boolean {
    return this.currentPage < this.pages.length - 1;
  }

  previousPage(): void {
    this.currentPage--;
  }

  nextPage(): void {
    this.currentPage++;
  }

  performSingleAction(action: SingleAction, reservation: Reservation): void {
    switch (action) {
      case SingleAction.Delete:
        this.deleteReservations([reservation]);
        break;
    }
  }

  performBulkAction(action: BulkAction): void {
    switch (action) {
      case BulkAction.SelectAll:
        this.form.setValue(
          this.reservations
            .map(reservation => 'reservation' + reservation.id)
            .reduce((acc, key) => ({ ...acc, [key]: true }), {})
        );
        break;
      case BulkAction.ClearAll:
        this.form.setValue(
          this.reservations
            .map(reservation => 'reservation' + reservation.id)
            .reduce((acc, key) => ({ ...acc, [key]: false }), {})
        );
        break;
      case BulkAction.DeleteSelected:
        this.deleteReservations(
          this.reservations
            .filter(reservation => this.form.value['reservation' + reservation.id])
        );
        break;
    }
  }

  deleteReservations(reservations: Reservation[]): void {
    forkJoin(
      reservations
        .map(reservation => reservation.id)
        .map(this.reservationService.deleteReservation)
    )
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(_ => this.updateReservations());
  }

  sortReservations(reservations: Reservation[]): Reservation[] {
    if (!this.sortKey) {
      return [...reservations];
    }
    const fetchKey = (reservation: Reservation): any => {
      switch (this.sortKey) {
        case SortKey.TripDate:
          return [reservation.tripDate.checkInDate, reservation.tripDate.checkOutDate];
        case SortKey.ListingsName:
          return [reservation.listingName.name, reservation.listingName.location];
        case SortKey.Nights:
          return reservation.nights;
        case SortKey.Guests:
          return reservation.guests;
        case SortKey.Price:
          return reservation.price;
        case SortKey.Status:
          return reservation.status;
      }
    };
    const compareKeys = (res1: Reservation, res2: Reservation): -1 | 0 | 1 => {
      const key1 = fetchKey(res1);
      const key2 = fetchKey(res2);
      const defaultCompare = (a, b) => a < b ? -1 : (a > b ? 1 : 0);
      let compare = defaultCompare;
      if (key1 && typeof key1 === 'object' && key1.constructor === Array) {
        compare = (a, b) => {
          const arr1 = a as any[];
          const arr2 = b as any[];
          const len = Math.min(arr1.length, arr2.length);
          for (let i = 0; i < len; i++) {
            if (arr1[i] < arr2[i]) {
              return -1;
            }
            if (arr1[i] > arr2[i]) {
              return 1;
            }
          }
          return defaultCompare(arr1.length, arr2.length);
        };
      }
      return compare(key1, key2);
    };

    return [...reservations].sort(compareKeys);
  }

  filterReservations(reservations: Reservation[]): Reservation[] {
    if (!this.filterEnabled || !this.filters) {
      return [...reservations];
    }

    const filterFns: ((reservation: Reservation) => boolean)[] = [];

    if (Object.values(this.filters.status).some(Boolean)) {
      filterFns.push(reservation => {
        switch (reservation.status) {
          case Status.Accepted:
            return this.filters.status.accepted;
          case Status.Expired:
            return this.filters.status.expired;
          case Status.Canceled:
            return this.filters.status.canceled;
          case Status.Declined:
            return this.filters.status.declined;
        }
      });
    }

    if (Object.values(this.filters.nights).some(Boolean)) {
      filterFns.push(reservation => {
        switch (reservation.nights) {
          case 1:
            return this.filters.nights.oneNight;
          case 2:
            return this.filters.nights.twoNights;
          case 3:
            return this.filters.nights.threeNights;
          case 4:
            return this.filters.nights.fourNights;
          case 5:
            return this.filters.nights.fiveNights;
          default:
            return this.filters.nights.overFiveNights;
        }
      });
    }

    if (Object.values(this.filters.guests).some(Boolean)) {
      filterFns.push(reservation => {
        switch (reservation.guests) {
          case 1:
            return this.filters.guests.oneGuest;
          case 2:
            return this.filters.guests.twoGuests;
          case 3:
            return this.filters.guests.threeGuests;
          case 4:
            return this.filters.guests.fourGuests;
          case 5:
            return this.filters.guests.fiveGuests;
          default:
            return this.filters.guests.overFiveGuests;
        }
      });
    }

    return filterFns.reduce(
      (acc, filterFn) => acc.filter(filterFn),
      reservations
    );
  }
}
