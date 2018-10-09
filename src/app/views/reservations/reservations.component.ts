import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { State } from '../../reducers';
import { SortKey } from '../../reducers/reservations-view.reducer';
import {
  $filteredReservationsCount, $filterTextOnly,
  $nextPageAvailable,
  $previousPageAvailable,
  $sortedFilteredReservationRowsOnPage,
  $sortKeys
} from '../../selectors/reservations-view.selectors';
import {
  ClearFilteredReservations,
  ClearReservations,
  DeleteSelectedReservations,
  NextPage,
  PreviousPage,
  SelectFilteredReservations,
  SelectReservations, ToggleFilterTextOnlyFlag,
  UpdateReservationsSortKey
} from '../../actions/reservations-view.action';
import { DeleteReservations } from '../../actions/reservations.action';
import { ReservationRow } from '../../models/reservation-row.model';
import { $currency, $currencyRate } from '../../selectors/currency.selectors';

enum BulkAction {
  SelectAll = 'selectAll',
  ClearAll = 'clearAll',
  DeleteSelected = 'deleteSelected'
}

enum SingleAction {
  Delete = 'delete'
}

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.scss']
})
export class ReservationsComponent {
  reservationRows$ = this.store.pipe(select($sortedFilteredReservationRowsOnPage));
  filteredReservationsCount$ = this.store.pipe(select($filteredReservationsCount));
  previousPageAvailable$ = this.store.pipe(select($previousPageAvailable));
  nextPageAvailable$ = this.store.pipe(select($nextPageAvailable));
  filterTextOnly$ = this.store.pipe(select($filterTextOnly));
  sortKeys$ = this.store.pipe(select($sortKeys));
  currency$ = this.store.pipe(select($currency));
  rate$ = this.store.pipe(select($currencyRate));
  readonly bulkActions = Object.values(BulkAction);
  readonly singleActions = Object.values(SingleAction);

  constructor(
    private store: Store<State>
  ) {}

  toggleFilterTextOnly(): void {
    this.store.dispatch(new ToggleFilterTextOnlyFlag());
  }

  onToggleSelect(selected: boolean, id: number): void {
    if (selected) {
      this.store.dispatch(new SelectReservations([id]));
    } else {
      this.store.dispatch(new ClearReservations([id]));
    }
  }

  onSortKeyChange(sortKey: SortKey): void {
    this.store.dispatch(new UpdateReservationsSortKey(sortKey));
  }

  spansYears(reservationRow: ReservationRow): boolean {
    return reservationRow.tripDate.checkInDate.split('-')[0]
      !== reservationRow.tripDate.checkOutDate.split('-')[0];
  }

  spansMonths(reservationRow: ReservationRow): boolean {
    return reservationRow.tripDate.checkInDate.split('-')[1]
      !== reservationRow.tripDate.checkOutDate.split('-')[1];
  }

  previousPage(): void {
    this.store.dispatch(new PreviousPage());
  }

  nextPage(): void {
    this.store.dispatch(new NextPage());
  }

  performSingleAction(action: SingleAction, reservationRow: ReservationRow): void {
    switch (action) {
      case SingleAction.Delete:
        this.store.dispatch(new DeleteReservations([reservationRow.id]));
        break;
    }
  }

  performBulkAction(action: BulkAction): void {
    switch (action) {
      case BulkAction.SelectAll:
        this.store.dispatch(new SelectFilteredReservations());
        break;
      case BulkAction.ClearAll:
        this.store.dispatch(new ClearFilteredReservations());
        break;
      case BulkAction.DeleteSelected:
        this.store.dispatch(new DeleteSelectedReservations());
        break;
    }
  }
}
